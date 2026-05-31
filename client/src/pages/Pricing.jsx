import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 0, yearly: 0 },
    description: "Pour les petits agriculteurs qui débutent.",
    badge: null,
    cta: "Commencer gratuitement",
    ctaVariant: "outline",
    features: [
      { text: "2 appareils IoT", included: true },
      { text: "Tableau de bord en temps réel", included: true },
      { text: "Alertes SMS / Email", included: false },
      { text: "Analyses avancées", included: false },
      { text: "Rapports téléchargeables", included: false },
      { text: "Support prioritaire", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 4900, yearly: 3900 },
    description: "Pour les exploitations en pleine croissance.",
    badge: "Recommandé",
    cta: "Essayer Pro",
    ctaVariant: "primary",
    features: [
      { text: "10 appareils IoT", included: true },
      { text: "Tableau de bord en temps réel", included: true },
      { text: "Alertes SMS / Email", included: true },
      { text: "Analyses avancées", included: true },
      { text: "Rapports téléchargeables", included: true },
      { text: "Support prioritaire", included: false },
    ],
  },
];

const CheckIcon = ({ included }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    {included ? (
      <>
        <circle cx="9" cy="9" r="9" fill="#22c55e" fillOpacity="0.15" />
        <path
          d="M5.5 9L7.8 11.5L12.5 6.5"
          stroke="#22c55e"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <circle cx="9" cy="9" r="9" fill="#6b7280" fillOpacity="0.1" />
        <path
          d="M6.5 11.5L11.5 6.5M11.5 11.5L6.5 6.5"
          stroke="#9ca3af"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  const formatPrice = (price) =>
    price === 0
      ? "Gratuit"
      : `${price.toLocaleString("fr-DZ")} DZD`;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f0a", color: "#f0fdf4" }}>
      {/* Hero */}
      <div
        style={{
          background:
            "linear-gradient(180deg, #052e16 0%, #0a0f0a 100%)",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            style={{
              display: "inline-block",
              background: "#22c55e22",
              color: "#22c55e",
              border: "1px solid #22c55e44",
              borderRadius: "999px",
              padding: "6px 18px",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              marginBottom: "24px",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Tarification AgriSense DZ
          </span>

          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: "0 0 20px",
              color: "#f0fdf4",
            }}
          >
            Des plans adaptés à
            <br />
            <span style={{ color: "#22c55e" }}>chaque exploitation</span>
          </h1>

          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "18px",
              color: "#86efac",
              maxWidth: "500px",
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Gérez vos cultures intelligemment avec nos appareils IoT.
            Choisissez le plan qui correspond à vos besoins.
          </p>

          {/* Billing Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "#052e16",
              border: "1px solid #166534",
              borderRadius: "999px",
              padding: "4px",
              gap: "4px",
            }}
          >
            {["monthly", "yearly"].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  padding: "8px 22px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  background: billing === b ? "#22c55e" : "transparent",
                  color: billing === b ? "#052e16" : "#86efac",
                }}
              >
                {b === "monthly" ? "Mensuel" : "Annuel"}
                {b === "yearly" && (
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "11px",
                      background: billing === "yearly" ? "#052e16" : "#22c55e22",
                      color: billing === "yearly" ? "#22c55e" : "#22c55e",
                      borderRadius: "999px",
                      padding: "2px 8px",
                    }}
                  >
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Plans */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{
              position: "relative",
              background: plan.id === "pro" ? "#052e16" : "#111711",
              border: `1px solid ${plan.id === "pro" ? "#22c55e" : "#1f2d1f"}`,
              borderRadius: "20px",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {plan.badge && (
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#22c55e",
                  color: "#052e16",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "5px 18px",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.05em",
                }}
              >
                ✦ {plan.badge}
              </div>
            )}

            {/* Plan header */}
            <div>
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#22c55e",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "42px",
                  fontWeight: 800,
                  color: "#f0fdf4",
                  lineHeight: 1,
                }}
              >
                {formatPrice(plan.price[billing])}
                {plan.price[billing] > 0 && (
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "#86efac",
                      marginLeft: "6px",
                    }}
                  >
                    / {billing === "monthly" ? "mois" : "mois, facturé annuellement"}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "14px",
                  color: "#6b7280",
                  marginTop: "10px",
                  lineHeight: 1.5,
                }}
              >
                {plan.description}
              </p>
            </div>

            {/* CTA */}
            <Link
              to={plan.id === "basic" ? "/register" : "/checkout"}
              state={{ plan: plan.id, billing }}
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                padding: "14px",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "all 0.2s",
                ...(plan.ctaVariant === "primary"
                  ? {
                      background: "#22c55e",
                      color: "#052e16",
                      border: "none",
                    }
                  : {
                      background: "transparent",
                      color: "#22c55e",
                      border: "1px solid #22c55e44",
                    }),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {plan.cta}
            </Link>

            {/* Features */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              {plan.features.map((f, fi) => (
                <li
                  key={fi}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "14px",
                    color: f.included ? "#d1fae5" : "#4b5563",
                  }}
                >
                  <CheckIcon included={f.included} />
                  {f.text}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* FAQ strip */}
      <div
        style={{
          borderTop: "1px solid #1f2d1f",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Des questions ?{" "}
          <Link
            to="/contact"
            style={{ color: "#22c55e", textDecoration: "none", fontWeight: 600 }}
          >
            Contactez notre équipe
          </Link>
        </p>
      </div>
    </div>
  );
}