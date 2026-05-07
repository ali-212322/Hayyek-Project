import React, { useState } from "react";
import C from "../../styles/colors";
import { ADMIN_STATS, PROVIDER_REQUESTS, COMPLAINTS_DATA } from "../../data/adminData";

function AdminDashboard({ onBack }) {
  const [providerRequests, setProviderRequests] = useState(PROVIDER_REQUESTS);
  const [complaints, setComplaints] = useState(COMPLAINTS_DATA);

  const approveProvider = (id) => {
    setProviderRequests(reqs => reqs.map(req => req.id === id ? { ...req, status: "approved" } : req));
  };
  const rejectProvider = (id) => {
    setProviderRequests(reqs => reqs.map(req => req.id === id ? { ...req, status: "rejected" } : req));
  };
  const resolveComplaint = (id) => {
    setComplaints(comps => comps.map(comp => comp.id === id ? { ...comp, status: "resolved" } : comp));
  };

  const statusCls = {
    pending: "badge-pending",
    approved: "badge-approved",
    rejected: "badge-rejected",
    open: "badge-pending",
    resolved: "badge-done",
  };

  const NAV = [
    { icon: "📊", label: "Dashboard", active: true },
    { icon: "👤", label: "Users" },
    { icon: "🏪", label: "Providers", badge: providerRequests.filter(r => r.status === "pending").length },
    { icon: "📋", label: "Orders" },
    { icon: "🛠️", label: "Services" },
    { icon: "💬", label: "Complaints", badge: complaints.filter(c => c.status === "open").length },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="ad-shell">
      <aside className="sidebar ad-sidebar">
        <div className="sidebar-logo">حيّك<span>.</span></div>
        <nav className="ad-nav" style={{ padding: "1.1rem 0", flex: 1 }}>
          {NAV.map(n => (
            <div key={n.label} className={`sidebar-item ${n.active ? "active" : ""}`}>
              <span className="sidebar-icon">{n.icon}</span>{n.label}
              {n.badge > 0 && <span className="sidebar-badge">{n.badge}</span>}
            </div>
          ))}
        </nav>
      </aside>

      <main className="ad-main">
        <div className="ad-topbar">
          <div className="ad-topbar-title">Admin Dashboard</div>
          <div className="ad-topbar-r">
            <div className="notif-btn">🔔<span className="notif-dot" /></div>
            <div style={{ fontSize: ".82rem", color: C.muted, fontWeight: 600 }}>Wed, 6 May 2026</div>
          </div>
        </div>

        <div className="ad-content">
          {/* STATS */}
          <div className="stat-grid">
            {ADMIN_STATS.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-label">{s.label}</div>
                <div className="stat-val">{s.val}</div>
                <div className={`stat-trend ${s.cls}`}>{s.trend}</div>
              </div>
            ))}
          </div>

          <div className="admin-bottom-grid">
            {/* PROVIDER REQUESTS */}
            <div className="card admin-table-card">
              <div className="card-header">
                <div><div className="card-title">New Provider Requests</div></div>
                <button className="card-action">View all →</button>
              </div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Service</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {providerRequests.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.name}</td>
                        <td>{r.service}</td>
                        <td>{r.date}</td>
                        <td><span className={`badge ${statusCls[r.status]}`}>{r.status}</span></td>
                        <td>
                          {r.status === "pending" && (
                            <div className="action-btns">
                              <button className="btn-approve" onClick={() => approveProvider(r.id)}>Approve</button>
                              <button className="btn-reject" onClick={() => rejectProvider(r.id)}>Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* COMPLAINTS */}
            <div className="card admin-table-card">
              <div className="card-header">
                <div><div className="card-title">Recent Complaints</div></div>
                <button className="card-action">View all →</button>
              </div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Order</th><th>Customer</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {complaints.map(c => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td>{c.orderId}</td>
                        <td>{c.customer}</td>
                        <td><span className={`badge ${statusCls[c.status]}`}>{c.status}</span></td>
                        <td>
                          {c.status === "open" && (
                            <button className="btn-approve" onClick={() => resolveComplaint(c.id)}>Resolve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
