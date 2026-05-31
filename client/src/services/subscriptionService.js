// subscriptionService.js
// Firebase-based subscription management for AgriSense DZ
// Place in: client/src/services/subscriptionService.js

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // adjust path to your firebase config

// ─── Plan definitions ────────────────────────────────────────────────────────

export const PLANS = {
  basic: {
    id: "basic",
    name: "Basic",
    maxDevices: 2,
    features: {
      analytics: false,
      alerts: false,
      reports: false,
    },
    price: { monthly: 0, yearly: 0 },
  },
  pro: {
    id: "pro",
    name: "Pro",
    maxDevices: 10,
    features: {
      analytics: true,
      alerts: true,
      reports: true,
    },
    price: { monthly: 4900, yearly: 3900 },
  },
};

// ─── Read subscription ────────────────────────────────────────────────────────

/**
 * Get the current subscription for a farmer.
 * Returns the subscription doc or a default Basic plan if none exists.
 */
export async function getSubscription(userId) {
  const ref = doc(db, "subscriptions", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      planId: "basic",
      billing: "monthly",
      status: "active",
      startedAt: null,
      expiresAt: null,
    };
  }

  return snap.data();
}

/**
 * Convenience hook-friendly helper: returns the plan config merged with live status.
 */
export async function getActivePlan(userId) {
  const subscription = await getSubscription(userId);
  const plan = PLANS[subscription.planId] ?? PLANS.basic;

  return {
    ...plan,
    billing: subscription.billing,
    status: subscription.status,
    expiresAt: subscription.expiresAt,
  };
}

// ─── Write / upgrade subscription ────────────────────────────────────────────

/**
 * Activate or upgrade a user's subscription.
 * Call this after a successful payment confirmation.
 *
 * @param {string} userId
 * @param {"basic"|"pro"} planId
 * @param {"monthly"|"yearly"} billing
 * @param {object} [paymentMeta]  – optional payment reference (CIB, Baridimob ref, etc.)
 */
export async function activateSubscription(userId, planId, billing = "monthly", paymentMeta = {}) {
  if (!PLANS[planId]) throw new Error(`Unknown plan: ${planId}`);

  const now = new Date();
  const expiresAt = billing === "yearly"
    ? new Date(now.setFullYear(now.getFullYear() + 1))
    : new Date(now.setMonth(now.getMonth() + 1));

  const ref = doc(db, "subscriptions", userId);
  await setDoc(ref, {
    planId,
    billing,
    status: "active",
    startedAt: serverTimestamp(),
    expiresAt,
    updatedAt: serverTimestamp(),
    payment: paymentMeta,
  }, { merge: true });

  return { success: true, planId, expiresAt };
}

/**
 * Cancel a subscription (downgrades to Basic at period end).
 */
export async function cancelSubscription(userId) {
  const ref = doc(db, "subscriptions", userId);
  await updateDoc(ref, {
    status: "cancelled",
    updatedAt: serverTimestamp(),
  });
}

// ─── Feature gate helpers ─────────────────────────────────────────────────────

/**
 * Check if a user's plan allows a given feature.
 * Usage: const can = await canUseFeature(userId, "analytics");
 */
export async function canUseFeature(userId, featureKey) {
  const { status, planId } = await getSubscription(userId);
  if (status !== "active") return false;
  const plan = PLANS[planId] ?? PLANS.basic;
  return plan.features[featureKey] ?? false;
}

/**
 * Check if the user can add more devices.
 * Pass in currentDeviceCount from your devices collection.
 */
export async function canAddDevice(userId, currentDeviceCount) {
  const { status, planId } = await getSubscription(userId);
  if (status !== "active") return false;
  const plan = PLANS[planId] ?? PLANS.basic;
  return currentDeviceCount < plan.maxDevices;
}