// frontend/src/components/provider/ProviderReviews.jsx
import React from "react";

const reviews = [
  { id: 1, name: "Sara M.", date: "2 days ago", stars: 5, text: "Excellent service! Very prompt and professional." },
  { id: 2, name: "Nasser K.", date: "1 week ago", stars: 4, text: "Good service, arrived a bit late but overall satisfied." },
  { id: 3, name: "Layla A.", date: "2 weeks ago", stars: 5, text: "Amazing work, will definitely book again!" },
];

export default function ProviderReviews({ onBack }) {
  const avg = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "#2D6A4F", padding: "16px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Customer Reviews</span>
      </header>

      <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 20px 60px" }}>
        {/* Summary */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "28px", textAlign: "center", marginBottom: 20, boxShadow: "0 4px 16px rgba(45,106,79,0.09)" }}>
          <div style={{ fontSize: "3.5rem", fontWeight: 800, color: "#2D6A4F" }}>{avg}</div>
          <div style={{ fontSize: "1.5rem", color: "#f59e0b", margin: "6px 0" }}>{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{reviews.length} reviews</div>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{r.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{r.date}</div>
                </div>
                <div style={{ color: "#f59e0b" }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
              </div>
              <p style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.6, margin: 0 }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
