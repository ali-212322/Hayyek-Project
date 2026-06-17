import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ProviderOrders.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_META = {
  pending: { label: "Pending", bg: "#FEF3C7", color: "#92400E" },
  accepted: { label: "Accepted", bg: "#D1FAE5", color: "#065F46" },
  in_progress: { label: "In Progress", bg: "#DBEAFE", color: "#1E40AF" },
  completed: { label: "Completed", bg: "#D8F3DC", color: "#2D6A4F" },
  rejected: { label: "Rejected", bg: "#FEE2E2", color: "#991B1B" },
  cancelled: { label: "Cancelled", bg: "#FEE2E2", color: "#991B1B" },
};

function ProviderOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getOrders();
      setOrders(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const countFor = key => key === "all" ? orders.length : orders.filter(o => o.status === key).length;

  const updateOrder = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert(err.message || "Failed to update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="po-root">
      <header className="po-header">
        <button className="po-back" onClick={() => navigate("/provider")}> Back to dashboard</button>
        <div className="po-title">Provider Orders</div>
        <button className="po-back" onClick={fetchOrders} style={{ visibility: loading ? "hidden" : "visible" }}> Refresh</button>
      </header>

      <main className="po-container">
        {error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "10px", marginBottom: "1rem" }}>
             {error} <button onClick={fetchOrders} style={{ marginLeft: "8px", color: "#991b1b", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Retry</button>
          </div>
        )}

        <div className="po-filters">
          {FILTERS.map(item => (
            <button
              key={item.key}
              className={`po-filter-btn ${filter === item.key ? "active" : ""}`}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
              <span className="po-count">{countFor(item.key)}</span>
            </button>
          ))}
        </div>

        {loading && <div className="po-empty"><p>Loading orders…</p></div>}

        {!loading && filteredOrders.length === 0 && (
          <div className="po-empty">
            <p>No Orders</p>
            <p>No orders found for this filter.</p>
          </div>
        )}

        {!loading && filteredOrders.length > 0 && (
          <div className="po-list">
            {filteredOrders.map(order => {
              const status = STATUS_META[order.status] || STATUS_META.pending;
              return (
                <article key={order.id} className="po-card">
                  <div className="po-card-top">
                    <div>
                      <h3>{order.resident_name || "Customer"}</h3>
                      <div className="po-category">{order.service_name || order.notes || "Service request"}</div>
                    </div>
                    <span className="po-status" style={{ background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  <div className="po-rows">
                    {order.address && <div className="po-row"><span>Address</span><span>{order.address}</span></div>}
                    {order.total_price != null && <div className="po-row"><span>Amount</span><span>SAR {order.total_price}</span></div>}
                    <div className="po-row"><span>Date</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
                    {order.notes && <div className="po-row"><span>Notes</span><span>{order.notes}</span></div>}
                  </div>

                  {order.status === "pending" && (
                    <div className="po-actions">
                      <button className="po-action-btn po-accept" onClick={() => updateOrder(order.id, "accepted")} disabled={updatingId === order.id}>Accept</button>
                      <button className="po-action-btn po-cancel" onClick={() => updateOrder(order.id, "rejected")} disabled={updatingId === order.id}>Reject</button>
                    </div>
                  )}
                  {order.status === "accepted" && (
                    <div className="po-actions">
                      <button className="po-action-btn po-accept" onClick={() => updateOrder(order.id, "in_progress")} disabled={updatingId === order.id}>Start order</button>
                    </div>
                  )}
                  {order.status === "in_progress" && (
                    <div className="po-actions">
                      <button className="po-action-btn po-accept" onClick={() => updateOrder(order.id, "completed")} disabled={updatingId === order.id}>Mark completed</button>
                    </div>
                  )}

                  <div className="po-card-id">Order #{order.order_number || order.id}</div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProviderOrders;
