// UpgradeModal.jsx
// Reusable upgrade prompt for the AgriSense DZ farmer dashboard.
// Shows when a farmer tries to access a Pro-only feature.
//
// Usage:
//   <UpgradeModal
//     isOpen={showUpgrade}
//     onClose={() => setShowUpgrade(false)}
//     featureName="Analyses avancées"
//   />

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const LOCKED_FEATURES = [
  "10 appareils IoT",
  "Alertes SMS & Email",
  "Analyses avancées",
  "Rapports téléchargeables",
];

export default function UpgradeModal({ isOpen, onClose, featureName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 999,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              width: "min(440px, calc(100vw - 32px))",
              background: "#0d1f0d",
              border: "1px solid #22c55e55",
              borderRadius: "20px",
              padding: "36px",
              fontFamily: "'Manrope', sans-serif",
              color: "#f0fdf4",
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
                fontSize: "20px",
                lineHeight: 1,
                padding: "4px",
              }}
            >
              ✕
            </button>

            {/* Icon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                background: "#22c55e1a",
                border: "1px solid #22c55e33",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              🌱
            </div>

            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                margin: "0 0 8px",
                lineHeight: 1.2,
              }}
            >
              Passez au plan{" "}
              <span style={{ color: "#22c55e" }}>Pro</span>
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#86efac",
                margin: "0 0 24px",
                lineHeight: 1.6,
              }}
            >
              {featureName
                ? `"${featureName}" est disponible uniquement avec le plan Pro.`
                : "Débloquez toutes les fonctionnalités pour gérer votre exploitation efficacement."}
            </p>

            {/* Feature list */}
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 28px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {LOCKED_FEATURES.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    color: "#d1fae5",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      background: "#22c55e22",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "11px",
                      color: "#22c55e",
                    }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Price pill */}
            <div
              style={{
                background: "#052e16",
                borderRadius: "12px",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                border: "1px solid #166534",
              }}
            >
              <span style={{ fontSize: "13px", color: "#86efac" }}>Plan Pro mensuel</span>
              <span style={{ fontSize: "20px", fontWeight: 800, color: "#f0fdf4" }}>
                4 900{" "}
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#86efac" }}>
                  DZD / mois
                </span>
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                to="/pricing"
                state={{ highlight: "pro" }}
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#22c55e",
                  color: "#052e16",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "14px",
                  borderRadius: "12px",
                  textDecoration: "none",
                }}
              >
                Voir les plans →
              </Link>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "1px solid #1f2d1f",
                  color: "#6b7280",
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  padding: "12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                Peut-être plus tard
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}