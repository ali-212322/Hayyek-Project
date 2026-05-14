// frontend/src/components/resident/ResidentOrders.jsx
import React, { useState } from "react";
import { getOrders, STATUS_LABELS, STATUS_COLORS } from "../shared/providers";
import "./ResidentOrders.css";

const MOCK_RESIDENT_ID = "user-1";

export default function ResidentOrders({ onBack, onNavigate }) {
  const [filter, setFilter] = useState("all");
  const orders = getOrders(MOCK_RESIDENT_ID);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="ro-root">
      <header className="ro-header">
        <button className="ro-back" onClick={onBack}>← Back</button>
        <span className="ro-title">My Orders</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="ro-container">
        {/* Filter tabs */}
        <div className="ro-filters">
          {["all", "pending", "in_progress", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              className={`ro-filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="ro-empty">
            <p>🗂️</p>
            <p>No orders found.</p>
            <button className="ro-browse-btn" onClick={() => onNavigate("home")}>Browse Services</button>
          </div>
        )}

        <div className="ro-list">
          {filtered.map((order) => (
            <div key={order.id} className="ro-card">
              <div className="ro-card-top">
                <div>
                  <h3>{order.providerName}</h3>
                  <p className="ro-category">{order.category}</p>
                </div>
                <span
                  className="ro-status"
                  style={{ background: STATUS_COLORS[order.status] + "22", color: STATUS_COLORS[order.status] }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="ro-card-rows">
                <div className="ro-row">
                  <span>🔧 Service</span>
                  <span>{order.service}</span>
                </div>
                <div className="ro-row">
                  <span>📍 Address</span>
                  <span>{order.address}</span>
                </div>
                <div className="ro-row">
                  <span>📅 Date</span>
                  <span>{order.date}</span>
                </div>
                <div className="ro-row">
                  <span>💰 Price</span>
                  <span>SAR {order.price}</span>
                </div>
                {order.notes && (
                  <div className="ro-row">
                    <span>📝 Notes</span>
                    <span>{order.notes}</span>
                  </div>
                )}
              </div>

              <div className="ro-card-id">Order #{order.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
