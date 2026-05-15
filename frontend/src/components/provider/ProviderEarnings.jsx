import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function ProviderEarnings() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.getOrders();
        setOrders(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      } catch (err) {
        setError("Failed to load earnings data.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const completedOrders = orders.filter(o => o.status === "completed");

  const filterByPeriod = (orderList) => {
    const now = new Date();
    return orderList.filter(o => {
      const created = new Date(o.created_at);
      if (period === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return created >= weekAgo;
      }
      if (period === "month") {
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }
      if (period === "year") {
        return created.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const periodOrders = filterByPeriod(completedOrders);
  const totalEarnings = periodOrders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
  const avgPerOrder = periodOrders.length ? (totalEarnings / periodOrders.length).toFixed(0) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "#2D6A4F", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/provider")} style={{ background: "none", border: "none", color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Earnings</span>
      </header>

      <div style={{ maxWidth: 700, margin: "32px auto", padding: "0 20px 60px", display: "flex", flexDirection: "column", gap: 20 }}>
        {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "10px" }}>⚠️ {error}</div>}
        {loading && <div style={{ textAlign: "center", color: "#2D6A4F", padding: "2rem" }}>Loading earnings…</div>}

        {!loading && !error && (
          <>
            {/* Period toggle */}
            <div style={{ display: "flex", gap: 8 }}>
              {["week", "month", "year"].map(p => (
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

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {[
                { label: "Total Earnings", val: `SAR ${totalEarnings.toLocaleString()}`, icon: "💰" },
                { label: "Completed Orders", val: periodOrders.length, icon: "📦" },
                { label: "Avg per Order", val: `SAR ${avgPerOrder}`, icon: "📊" },
              ].map(k => (
                <div key={k.label} style={{ background: "#fff", borderRadius: 14, padding: "20px 16px", textAlign: "center", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
                  <div style={{ fontSize: "1.6rem" }}>{k.icon}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2D6A4F", margin: "6px 0" }}>{k.val}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Transactions */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: "0.95rem" }}>Completed Orders This {period.charAt(0).toUpperCase() + period.slice(1)}</div>
              {periodOrders.length === 0 ? (
                <div style={{ textAlign: "center", color: "#9ca3af", padding: "1rem" }}>No completed orders in this period.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {periodOrders.map(o => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{o.service_name || o.notes || "Service"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{o.resident_name || "Customer"} · {new Date(o.created_at).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: "#2D6A4F" }}>SAR {o.total_price || 0}</div>
                        <div style={{ fontSize: "0.72rem", padding: "2px 10px", borderRadius: 20, marginTop: 4, background: "#d1fae5", color: "#065f46" }}>completed</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
