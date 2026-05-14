// frontend/src/components/provider/ProviderDashboard.jsx
import React, { useState } from "react";
import C from "../../styles/colors";
import { ORDERS_DATA, SVCS_DATA } from "../../data/providerData";

function ProviderDashboard({ onBack, onNavigate }) {
  const [available, setAvailable] = useState(true);
  const [period, setPeriod] = useState("month");
  const [svcs, setSvcs] = useState(SVCS_DATA);
  const [orders, setOrders] = useState(ORDERS_DATA);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const updateOrder = (id, status) =>
    setOrders((o) => o.map((ord) => (ord.id === id ? { ...ord, status } : ord)));
  const toggleSvc = (i) =>
    setSvcs((s) => s.map((sv, idx) => (idx === i ? { ...sv, on: !sv.on } : sv)));

  const statusLabel = {
    pending: "⏳ Pending",
    accepted: "✅ Accepted",
    inprogress: "🔄 In Progress",
    completed: "✔ Completed",
    rejected: "✗ Rejected",
  };
  const statusCls = {
    pending: "badge-pending",
    accepted: "badge-accepted",
    inprogress: "badge-progress",
    completed: "badge-done",
    rejected: "badge-rejected",
  };

  // Map sidebar label → onNavigate key
  const NAV_MAP = {
    Dashboard: null,           // stay on this page
    Orders: "orders",
    "My Services": null,       // handled inline on dashboard
    Earnings: "earnings",
    Reviews: "reviews",
    Settings: "settings",
  };

  const NAV = [
    { icon: "📊", label: "Dashboard" },
    { icon: "📋", label: "Orders", badge: orders.filter((o) => o.status === "pending").length || null },
    { icon: "🛍️", label: "My Services" },
    { icon: "💰", label: "Earnings" },
    { icon: "⭐", label: "Reviews" },
    { icon: "⚙️", label: "Settings" },
  ];

  const handleNav = (label) => {
    setActiveNav(label);
    const target = NAV_MAP[label];
    if (target && onNavigate) onNavigate(target);
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="pd-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar pd-sidebar">
        <div className="sidebar-logo">
          حيّك<span>.</span>
        </div>

        <div className="sidebar-provider-info">
          <div className="sidebar-ava" style={{ background: C.gf, color: C.gd }}>
            AH
          </div>
          <div style={{ fontSize: ".84rem", fontWeight: 700, color: "#fff" }}>
            Ahmad Al-Harbi
          </div>
          <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.45)", marginTop: ".1rem" }}>
            <span className="pd-online-dot" />
            {available ? "Available" : "Busy"}
          </div>
        </div>

        <nav className="pd-nav" style={{ padding: "1.1rem 0", flex: 1 }}>
          {NAV.map((n) => (
            <div
              key={n.label}
              className={`sidebar-item ${activeNav === n.label ? "active" : ""}`}
              onClick={() => handleNav(n.label)}
              style={{ cursor: "pointer" }}
            >
              <span className="sidebar-icon">{n.icon}</span>
              {n.label}
              {n.badge ? <span className="sidebar-badge">{n.badge}</span> : null}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avail-row">
            <div
              className={`toggle-switch ${available ? "on" : "off"}`}
              onClick={() => setAvailable((v) => !v)}
            />
            <span style={{ fontSize: ".78rem", color: "rgba(255,255,255,.65)" }}>
              {available ? "I'm Available" : "Set as Busy"}
            </span>
          </div>
          <div
            className="sidebar-item"
            onClick={onBack}
            style={{ cursor: "pointer", marginTop: "8px", color: "rgba(255,100,100,0.75)" }}
          >
            <span className="sidebar-icon">🚪</span> Logout
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="pd-main">
        <div className="pd-topbar">
          <div className="pd-topbar-title">Provider Dashboard</div>
          <div className="pd-topbar-r">
            {/* Orders notification bell */}
            <div
              className="notif-btn"
              onClick={() => { setActiveNav("Orders"); onNavigate && onNavigate("orders"); }}
              style={{ cursor: "pointer", position: "relative" }}
              title="View pending orders"
            >
              🔔
              {pendingCount > 0 && <span className="notif-dot" />}
            </div>
            {/* Profile link */}
            <div
              style={{
                fontSize: ".82rem", color: C.muted, fontWeight: 600, cursor: "pointer",
                padding: "6px 12px", borderRadius: "8px", border: `1px solid ${C.gf || "#d8f3dc"}`,
              }}
              onClick={() => { setActiveNav("Profile"); onNavigate && onNavigate("profile"); }}
            >
              👤 Profile
            </div>
            <div style={{ fontSize: ".82rem", color: C.muted, fontWeight: 600 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>

        <div className="pd-content">
          {/* ── KPIs ── */}
          <div className="kpi-grid">
            {[
              { icon: "📦", label: "Orders Today", val: "7", change: "↑ +2 vs yesterday", cls: "up" },
              { icon: "💰", label: "Earnings Today", val: "SAR 640", change: "↑ +SAR 120", cls: "up" },
              { icon: "⭐", label: "Avg. Rating", val: "4.8", change: "142 reviews", cls: "up" },
              { icon: "✅", label: "Completion Rate", val: "96%", change: "↓ -1% this week", cls: "dn" },
            ].map((k) => (
              <div key={k.label} className="kpi-card">
                <div className="kpi-icon">{k.icon}</div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{k.val}</div>
                <div className={`kpi-change ${k.cls}`}>{k.change}</div>
              </div>
            ))}
          </div>

          <div className="pd-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* ── INCOMING ORDERS ── */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Incoming Orders</div>
                    {pendingCount > 0 && (
                      <div style={{ fontSize: ".75rem", color: "#f59e0b", marginTop: "2px" }}>
                        {pendingCount} pending action{pendingCount > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                  <button
                    className="card-action"
                    onClick={() => { setActiveNav("Orders"); onNavigate && onNavigate("orders"); }}
                  >
                    View all →
                  </button>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Time</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td><span className="order-id">{o.id}</span></td>
                          <td>
                            <div className="cust-row">
                              <div className="mini-ava">{o.cust[0]}</div>
                              {o.cust}
                            </div>
                          </td>
                          <td>{o.svc}</td>
                          <td style={{ color: C.muted, fontSize: ".8rem" }}>{o.time}</td>
                          <td style={{ fontWeight: 700 }}>{o.amt}</td>
                          <td>
                            <span className={`badge ${statusCls[o.status]}`}>
                              {statusLabel[o.status]}
                            </span>
                          </td>
                          <td>
                            {o.status === "pending" && (
                              <div className="action-btns">
                                <button className="btn-accept" onClick={() => updateOrder(o.id, "accepted")}>Accept</button>
                                <button className="btn-reject" onClick={() => updateOrder(o.id, "rejected")}>Reject</button>
                              </div>
                            )}
                            {o.status === "accepted" && (
                              <button className="btn-accept" onClick={() => updateOrder(o.id, "inprogress")}>Start</button>
                            )}
                            {o.status === "inprogress" && (
                              <button className="btn-primary" onClick={() => updateOrder(o.id, "completed")}>Complete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── MY SERVICES ── */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">My Services</div></div>
                  <button className="card-action">Add New →</button>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr><th>Service</th><th>Price</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {svcs.map((s, idx) => (
                        <tr key={s.name}>
                          <td>
                            <div className="cust-row">{s.icon} {s.name}</div>
                          </td>
                          <td>{s.price}</td>
                          <td>
                            <span className={`badge ${s.on ? "badge-approved" : "badge-suspend"}`}>
                              {s.on ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-ghost" onClick={() => toggleSvc(idx)}>
                                {s.on ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Earnings */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Earnings Overview</div></div>
                  <div className="card-actions">
                    {["week", "month", "year"].map((p) => (
                      <button
                        key={p}
                        className={`btn-ghost ${period === p ? "active" : ""}`}
                        onClick={() => setPeriod(p)}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="chart-card">[Chart for {period}ly Earnings]</div>
                <div style={{ textAlign: "center", marginTop: "8px", paddingBottom: "12px" }}>
                  <button
                    className="card-action"
                    onClick={() => { setActiveNav("Earnings"); onNavigate && onNavigate("earnings"); }}
                  >
                    Full Earnings Report →
                  </button>
                </div>
              </div>

              {/* Reviews */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Customer Reviews</div></div>
                  <button
                    className="card-action"
                    onClick={() => { setActiveNav("Reviews"); onNavigate && onNavigate("reviews"); }}
                  >
                    View all →
                  </button>
                </div>
                <div className="reviews-list" style={{ padding: "1.2rem 1.5rem" }}>
                  {[
                    { init: "SM", name: "Sara M.", date: "2 days ago", stars: "★★★★★", text: "Excellent service! Ahmad was prompt and fixed the AC quickly. Highly recommend." },
                    { init: "NK", name: "Nasser K.", date: "1 week ago", stars: "★★★★☆", text: "Good cleaning service, but arrived a bit late. Overall satisfied." },
                  ].map((r) => (
                    <div className="review-card" key={r.name}>
                      <div className="review-head">
                        <div className="review-ava" style={{ background: C.gl, color: C.gd }}>{r.init}</div>
                        <div>
                          <div className="review-name">{r.name}</div>
                          <div className="review-date">{r.date}</div>
                        </div>
                      </div>
                      <div className="review-stars">{r.stars}</div>
                      <p className="review-text">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick nav shortcuts */}
              <div className="card" style={{ padding: "1.2rem 1.5rem" }}>
                <div className="card-title" style={{ marginBottom: "12px" }}>Quick Links</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { icon: "👤", label: "My Profile", key: "profile" },
                    { icon: "⚙️", label: "Settings", key: "settings" },
                  ].map(({ icon, label, key }) => (
                    <button
                      key={key}
                      className="btn-ghost"
                      style={{ textAlign: "left", padding: "10px 14px", borderRadius: "10px" }}
                      onClick={() => { onNavigate && onNavigate(key); }}
                    >
                      {icon} {label} →
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProviderDashboard;
