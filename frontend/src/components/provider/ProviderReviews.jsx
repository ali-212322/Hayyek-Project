import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ProviderReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.getReviews();
        setReviews(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "#2D6A4F", padding: "16px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate("/provider")} style={{ background: "none", border: "none", color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Customer Reviews</span>
      </header>

      <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 20px 60px" }}>
        {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px" }}>⚠️ {error}</div>}
        {loading && <div style={{ textAlign: "center", color: "#2D6A4F", padding: "2rem" }}>Loading reviews…</div>}

        {!loading && !error && (
          <>
            {/* Summary */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px", textAlign: "center", marginBottom: 20, boxShadow: "0 4px 16px rgba(45,106,79,0.09)" }}>
              <div style={{ fontSize: "3.5rem", fontWeight: 800, color: "#2D6A4F" }}>{avg || "—"}</div>
              <div style={{ fontSize: "1.5rem", color: "#f59e0b", margin: "6px 0" }}>
                {avg ? "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg)) : "No ratings yet"}
              </div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
            </div>

            {reviews.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 14, padding: "28px", textAlign: "center", color: "#9ca3af", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
                No reviews yet. Complete some orders to start receiving reviews!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{r.resident_name || "Customer"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{new Date(r.created_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ color: "#f59e0b" }}>{"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}</div>
                    </div>
                    {r.comment && <p style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.6, margin: 0 }}>"{r.comment}"</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
