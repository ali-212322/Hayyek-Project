import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ResidentOrders.css";

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  accepted: "Accepted",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const STATUS_COLORS = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  accepted: "#10b981",
  completed: "#2D6A4F",
  cancelled: "#ef4444",
  rejected: "#ef4444",
};

export default function ResidentOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getOrders();
      const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setOrders(list);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await api.cancelOrder(id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    } catch (err) {
      alert(err.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="ro-root">
      <header className="ro-header">
        <button className="ro-back" onClick={() => navigate("/resident")}>← Back</button>
        <span className="ro-title">My Orders</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="ro-container">
        {/* Filter tabs */}
        <div className="ro-filters">
          {["all", "pending", "accepted", "in_progress", "completed", "cancelled"].map(s => (
            <button
              key={s}
              className={`ro-filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {loading && <div className="ro-empty"><p>Loading orders…</p></div>}
        {!loading && error && <div className="ro-empty"><p style={{ color: "#ef4444" }}>{error}</p><button className="ro-browse-btn" onClick={fetchOrders}>Retry</button></div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="ro-empty">
            <p>🗂️</p>
            <p>No orders found.</p>
            <button className="ro-browse-btn" onClick={() => navigate("/resident")}>Browse Services</button>
          </div>
        )}

        <div className="ro-list">
          {filtered.map(order => (
            <div key={order.id} className="ro-card">
              <div className="ro-card-top">
                <div>
                  <h3>{order.provider_name || "Provider"}</h3>
                  <p className="ro-category">{order.service_name || order.notes || "Service"}</p>
                </div>
                <span
                  className="ro-status"
                  style={{
                    background: (STATUS_COLORS[order.status] || "#9ca3af") + "22",
                    color: STATUS_COLORS[order.status] || "#9ca3af",
                  }}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              <div className="ro-card-rows">
                {order.address && (
                  <div className="ro-row"><span>📍 Address</span><span>{order.address}</span></div>
                )}
                {order.scheduled_at && (
                  <div className="ro-row"><span>📅 Scheduled</span><span>{new Date(order.scheduled_at).toLocaleString()}</span></div>
                )}
                {order.total_price != null && (
                  <div className="ro-row"><span>💰 Price</span><span>SAR {order.total_price}</span></div>
                )}
                {order.notes && (
                  <div className="ro-row"><span>📝 Notes</span><span>{order.notes}</span></div>
                )}
                <div className="ro-row"><span>🗓 Created</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
              </div>

              {order.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    className="ro-browse-btn"
                    style={{ background: "#2D6A4F", color: "#fff", flex: 1 }}
                    onClick={() => navigate("/resident/payment", {
                      state: {
                        orderId: order.order_number || order.id,
                        amount: order.price || 0,
                        description: "Hayyak - " + (order.provider_name || "Service")
                      }
                    })}
                  >
                    💳 Pay Now
                  </button>
                  <button
                    className="ro-browse-btn"
                    style={{ background: "#ef4444", color: "#fff", flex: 1 }}
                    onClick={() => handleCancel(order.id)}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? "Cancelling…" : "Cancel Order"}
                  </button>
                </div>
              )}

              <div className="ro-card-id">Order #{order.order_number || order.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
