import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, amount, description } = location.state || {};
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      navigate("/resident");
      return;
    }

    if (!window.Moyasar) {
      setError("Payment service unavailable. Please try again.");
      return;
    }

    window.Moyasar.init({
      element: ".moyasar-form",
      amount: Math.round((amount || 1) * 100),
      currency: "SAR",
      description: description || "Hayyak Service Payment",
      publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLIC_KEY,
      callback_url:
        window.location.origin +
        "/Hayyek-Project/resident/payment/callback?order_id=" +
        orderId,
      methods: ["creditcard"],
      on_completed: function (payment) {
        console.log("Payment completed:", payment);
      },
      on_failed: function (payment) {
        console.log("Payment failed:", payment);
      },
    });
  }, [orderId, amount, description, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faf8",
        fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
      }}
    >
      <header
        style={{
          background: "#2D6A4F",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate("/resident/orders")}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Back
        </button>

        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>
          Payment
        </span>
      </header>

      <div style={{ maxWidth: 500, margin: "32px auto", padding: "0 20px" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 4px 12px rgba(45,106,79,0.08)",
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#1a1a1a" }}>
            Order Summary
          </h3>

          <p
            style={{
              color: "#6b7280",
              margin: "0 0 4px",
              fontSize: "0.9rem",
            }}
          >
            Order #{orderId}
          </p>

          <p
            style={{
              color: "#2D6A4F",
              fontWeight: 700,
              fontSize: "1.2rem",
              margin: 0,
            }}
          >
            SAR {amount || "0.00"}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px 16px",
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 4px 12px rgba(45,106,79,0.08)",
          }}
        >
          <div className="moyasar-form"></div>
        </div>
      </div>
    </div>
  );
}