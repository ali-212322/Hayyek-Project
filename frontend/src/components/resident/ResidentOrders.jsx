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

  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedOrders, setReviewedOrders] = useState([]);

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

  const openReviewModal = (order) => {
    setReviewOrder(order);
    setRating(5);
    setComment("");
  };

  const closeReviewModal = () => {
    setReviewOrder(null);
    setRating(5);
    setComment("");
  };

  const getReviewErrorMessage = (err) => {
    const data = err?.response?.data;

    if (data?.code === "REVIEW_ALREADY_EXISTS") {
      return "You have already reviewed this order.";
    }

    if (data?.code === "ORDER_NOT_COMPLETED") {
      return "You can review the provider only after the order is completed.";
    }

    if (data?.message) {
      return data.message;
    }

    return "Failed to submit review.";
  };

  const handleSubmitReview = async () => {
    if (!reviewOrder) return;

    setSubmittingReview(true);

    try {
      await api.createReview({
        order: reviewOrder.id,
        provider: reviewOrder.provider,
        rating,
        comment,
      });

      setReviewedOrders(prev => [...prev, reviewOrder.id]);
      closeReviewModal();
      alert("Review submitted successfully.");
    } catch (err) {
      alert(getReviewErrorMessage(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="ro-root">
      <header className="ro-header">
        <button className="ro-back" onClick={() => navigate("/resident")}> Back</button>
        <span className="ro-title">My Orders</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="ro-container">
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

        {!loading && error && (
          <div className="ro-empty">
            <p style={{ color: "#ef4444" }}>{error}</p>
            <button className="ro-browse-btn" onClick={fetchOrders}>Retry</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="ro-empty">
            <p></p>
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
                  <div className="ro-row"><span> Address</span><span>{order.address}</span></div>
                )}
                {order.scheduled_at && (
                  <div className="ro-row"><span>📅 Scheduled</span><span>{new Date(order.scheduled_at).toLocaleString()}</span></div>
                )}
                {order.total_price != null && (
                  <div className="ro-row"><span> Price</span><span>SAR {order.total_price}</span></div>
                )}
                {order.notes && (
                  <div className="ro-row"><span> Notes</span><span>{order.notes}</span></div>
                )}
                <div className="ro-row"><span> Created</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
              </div>

              {order.status === "pending" && order.payment_status !== "paid" && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    className="ro-browse-btn"
                    style={{ background: "#2D6A4F", color: "#fff", flex: 1 }}
                    onClick={() => navigate("/resident/payment", {
                      state: {
                        orderId: order.id,
                        amount: Number(order.total_price || 0),
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

              {order.status === "completed" && !reviewedOrders.includes(order.id) && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    className="ro-browse-btn"
                    style={{ background: "#f59e0b", color: "#fff", flex: 1 }}
                    onClick={() => openReviewModal(order)}
                  >
                     Rate Provider
                  </button>
                </div>
              )}

              {order.status === "completed" && reviewedOrders.includes(order.id) && (
                <div style={{ marginTop: 8, color: "#2D6A4F", fontWeight: 600 }}>
                   Review submitted
                </div>
              )}

              <div className="ro-card-id">Order #{order.order_number || order.id}</div>
            </div>
          ))}
        </div>
      </div>

      {reviewOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
          onClick={closeReviewModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, color: "#1f2937" }}>Rate Provider</h2>
            <p style={{ color: "#6b7280", marginBottom: 16 }}>
              {reviewOrder.provider_name || "Provider"}
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Rating
              </label>
              <div style={{ display: "flex", gap: 6, fontSize: 32 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 32,
                      color: star <= rating ? "#f59e0b" : "#d1d5db",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                rows={4}
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  padding: 12,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="ro-browse-btn"
                style={{ background: "#e5e7eb", color: "#374151", flex: 1 }}
                onClick={closeReviewModal}
                disabled={submittingReview}
              >
                Cancel
              </button>
              <button
                className="ro-browse-btn"
                style={{ background: "#2D6A4F", color: "#fff", flex: 1 }}
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}