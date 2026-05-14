// frontend/src/components/provider/ProviderEarnings.jsx
import React, { useState } from "react";

const DATA = {
  week:  { total: "SAR 1,840", orders: 14, avg: "SAR 131", bars: [60, 80, 45, 90, 70, 100, 85] },
  month: { total: "SAR 7,200", orders: 58, avg: "SAR 124", bars: [40, 60, 75, 55, 80, 90, 70, 85, 65, 95, 50, 88] },
  year:  { total: "SAR 84,500", orders: 620, avg: "SAR 136", bars: [55, 65, 70, 60, 80, 90, 85, 95, 75, 88, 72, 100] },
};

const TRANSACTIONS = [
  { id: "TXN-001", service: "AC Gas Recharge", customer: "Sara M.", date: "2026-05-12", amount: "SAR 180", status: "paid" },
  { id: "TXN-002", service: "Deep Cleaning", customer: "Nasser K.", date: "2026-05-10", amount: "SAR 220", status: "paid" },
  { id: "TXN-003", service: "AC Installation", customer: "Layla A.", date: "2026-05-08", amount: "SAR 450", status: "pending" },
  { id: "TXN-004", service: "Filter Clean", customer: "Omar H.", date: "2026-05-06", amount: "SAR 120", status: "paid" },
];

export default function ProviderEarnings({ onBack }) {
  const [period, setPeriod] = useState("month");
  const d = DATA[period];
  const max = Math.max(...d.bars);

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "#2D6A4F", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Earnings</span>
      </header>

      <div style={{ maxWidth: 700, margin: "32px auto", padding: "0 20px 60px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Period toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          {["week","month","year"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "8px 20px", borderRadius: 50, border: "2px solid",
              borderColor: period === p ? "#2D6A4F" : "#d8f3dc",
              background: period === p ? "#2D6A4F" : "#fff",
              color: period === p ? "#fff" : "#2D6A4F",
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer"
            }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[
            { label: "Total Earnings", val: d.total, icon: "💰" },
            { label: "Total Orders", val: d.orders, icon: "📦" },
            { label: "Avg per Order", val: d.avg, icon: "📊" },
          ].map(k => (
            <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: "20px 16px", textAlign: "center", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
              <div style={{ fontSize: "1.6rem" }}>{k.icon}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2D6A4F", margin: "6px 0" }}>{k.val}</div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
          <div style={{ fontWeight: 700, marginBottom: 20, fontSize: "0.95rem" }}>Earnings Chart</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {d.bars.map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", borderRadius: "6px 6px 0 0",
                  height: `${(h / max) * 100}px`,
                  background: "linear-gradient(to top, #2D6A4F, #52B788)",
                  transition: "height 0.3s"
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.95rem" }}>Recent Transactions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TRANSACTIONS.map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.service}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{t.customer} · {t.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "#2D6A4F" }}>{t.amount}</div>
                  <div style={{ fontSize: "0.72rem", padding: "2px 10px", borderRadius: 20, marginTop: 4,
                    background: t.status === "paid" ? "#d1fae5" : "#fef3c7",
                    color: t.status === "paid" ? "#065f46" : "#92400e"
                  }}>{t.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
