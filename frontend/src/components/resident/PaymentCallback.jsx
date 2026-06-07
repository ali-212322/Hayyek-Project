import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyMoyasarPayment = async () => {
      const paymentStatus = searchParams.get("status");
      const orderId = searchParams.get("order_id");
      const paymentId = searchParams.get("id");
      const message = searchParams.get("message");

      if (!orderId) {
        setStatus("failed");
        setErrorMessage("Missing order ID.");
        return;
      }

      if (paymentStatus === "failed") {
        setStatus("failed");
        setErrorMessage(message || "Payment failed. Please try again.");
        return;
      }

      if (!paymentId) {
        setStatus("failed");
        setErrorMessage("Missing Moyasar payment ID.");
        return;
      }

      try {
        await api.verifyPayment({
          order: orderId,
          payment_id: paymentId,
        });

        setStatus("success");

        setTimeout(() => {
          navigate("/resident/orders");
        }, 3000);
      } catch (err) {
        setStatus("failed");
        setErrorMessage(
          err.message || "Payment verification failed. Please contact support."
        );
      }
    };

    verifyMoyasarPayment();
  }, [navigate, searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faf8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(45,106,79,0.08)",
          maxWidth: 420,
        }}
      >
        {status === "loading" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>⏳</div>
            <h2 style={{ color: "#1a1a1a" }}>Verifying Payment...</h2>
            <p style={{ color: "#6b7280" }}>
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#2D6A4F" }}>Payment Successful!</h2>
            <p style={{ color: "#6b7280" }}>
              Your payment has been verified. Redirecting to your orders...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>❌</div>
            <h2 style={{ color: "#ef4444" }}>Payment Failed</h2>
            <p style={{ color: "#6b7280" }}>
              {errorMessage || "Please try again."}
            </p>

            <button
              onClick={() => navigate("/resident/orders")}
              style={{
                background: "#2D6A4F",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                cursor: "pointer",
                fontWeight: 600,
                marginTop: 16,
              }}
            >
              Back to Orders
            </button>
          </>
        )}
      </div>
    </div>
  );
}