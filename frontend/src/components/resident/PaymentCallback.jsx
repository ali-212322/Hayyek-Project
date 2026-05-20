import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const paymentStatus = searchParams.get("status");
    const orderId = searchParams.get("order_id");
    const message = searchParams.get("message");

    if (paymentStatus === "paid") {
      setStatus("success");
      setTimeout(() => navigate("/resident/orders"), 3000);
    } else if (paymentStatus === "failed") {
      setStatus("failed");
    } else {
      setStatus("pending");
      setTimeout(() => navigate("/resident/orders"), 3000);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px", textAlign: "center", boxShadow: "0 4px 12px rgba(45,106,79,0.08)", maxWidth: 400 }}>
        {status === "loading" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>⏳</div>
            <h2 style={{ color: "#1a1a1a" }}>Processing Payment...</h2>
          </>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#2D6A4F" }}>Payment Successful!</h2>
            <p style={{ color: "#6b7280" }}>Redirecting to your orders...</p>
          </>
        )}
        {status === "failed" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>❌</div>
            <h2 style={{ color: "#ef4444" }}>Payment Failed</h2>
            <p style={{ color: "#6b7280" }}>Please try again.</p>
            <button
              onClick={() => navigate("/resident/orders")}
              style={{ background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", fontWeight: 600, marginTop: 16 }}
            >
              Back to Orders
            </button>
          </>
        )}
        {status === "pending" && (
          <>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>⏳</div>
            <h2 style={{ color: "#f59e0b" }}>Payment Pending</h2>
            <p style={{ color: "#6b7280" }}>Redirecting to your orders...</p>
          </>
        )}
      </div>
    </div>
  );
}
