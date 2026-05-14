import React, { useState } from "react";
import "./ProviderOrders.css";
import { ORDERS_DATA } from "../../data/providerData";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "inprogress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_META = {
  pending: { label: "Pending", bg: "#FEF3C7", color: "#92400E" },
  accepted: { label: "Accepted", bg: "#D1FAE5", color: "#065F46" },
  inprogress: { label: "In Progress", bg: "#DBEAFE", color: "#1E40AF" },
  completed: { label: "Completed", bg: "#D8F3DC", color: "#2D6A4F" },
  rejected: { label: "Rejected", bg: "#FEE2E2", color: "#991B1B" },
};

function ProviderOrders({ onBack }) {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState(ORDERS_DATA);

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((order) => order.status === filter);

  const countFor = (key) => key === "all"
    ? orders.length
    : orders.filter((order) => order.status === key).length;

  const updateOrder = (id, status) => {
    setOrders((current) => current.map((order) => (
      order.id === id ? { ...order, status } : order
    )));
  };

  return (
    <div className="po-root">
      <header className="po-header">
        <button className="po-back" onClick={onBack}>← Back to dashboard</button>
        <div className="po-title">Provider Orders</div>
        <div />
      </header>

      <main className="po-container">
        <div className="po-filters">
          {FILTERS.map((item) => (
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

        {filteredOrders.length === 0 ? (
          <div className="po-empty">
            <p>📭</p>
            <p>No orders found for this filter.</p>
          </div>
        ) : (
          <div className="po-list">
            {filteredOrders.map((order) => {
              const status = STATUS_META[order.status] || STATUS_META.pending;
              return (
                <article key={order.id} className="po-card">
                  <div className="po-card-top">
                    <div>
                      <h3>{order.cust}</h3>
                      <div className="po-category">{order.svc}</div>
                    </div>
                    <span
                      className="po-status"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="po-rows">
                    <div className="po-row"><span>Time</span><span>{order.time}</span></div>
                    <div className="po-row"><span>Amount</span><span>{order.amt}</span></div>
                    <div className="po-row"><span>Customer</span><span>{order.cust}</span></div>
                  </div>

                  {order.status === "pending" && (
                    <div className="po-actions">
                      <button className="po-action-btn po-accept" onClick={() => updateOrder(order.id, "accepted")}>Accept</button>
                      <button className="po-action-btn po-cancel" onClick={() => updateOrder(order.id, "rejected")}>Reject</button>
                    </div>
                  )}

                  {order.status === "accepted" && (
                    <div className="po-actions">
                      <button className="po-action-btn po-accept" onClick={() => updateOrder(order.id, "inprogress")}>Start order</button>
                    </div>
                  )}

                  {order.status === "inprogress" && (
                    <div className="po-actions">
                      <button className="po-action-btn po-accept" onClick={() => updateOrder(order.id, "completed")}>Mark completed</button>
                    </div>
                  )}

                  <div className="po-card-id">Order ID {order.id}</div>
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
