import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsRes, allProvidersRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        Promise.all([
          api.getAdminProviders("pending"),
          api.getAdminProviders("approved"),
          api.getAdminProviders("rejected"),
        ]).then(([p, a, r]) => ({
          data: [
            ...(Array.isArray(p.data) ? p.data : []),
            ...(Array.isArray(a.data) ? a.data : []),
            ...(Array.isArray(r.data) ? r.data : []),
          ]
        })),
        api.getAdminUsers(),
      ]);
      setStats(statsRes.data || statsRes);
      setProviders(Array.isArray(allProvidersRes.data) ? allProvidersRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.results || []));
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const approveProvider = async (id) => {
    setUpdatingId(id);
    try {
      await api.approveProvider(id);
      setProviders(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
    } catch (err) {
      alert(err.message || "Failed to approve provider.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const statusCls = { pending: "badge-pending", approved: "badge-approved", rejected: "badge-rejected", suspended: "badge-suspend" };
  const pendingCount = providers.filter(p => p.status === "pending").length;
  const NAV = [
    { icon: "📊", label: "Dashboard" },
    { icon: "👤", label: "Users", badge: users.length || null },
    { icon: "🏪", label: "Providers", badge: pendingCount || null },
    { icon: "⚙️", label: "Settings" },
  ];
  const STATS_CARDS = stats ? [
    { label: "Total Users", val: stats.total_users || 0, trend: "registered accounts" },
    { label: "Active Providers", val: stats.total_providers || 0, trend: "approved providers" },
    { label: "Total Orders", val: stats.total_orders || 0, trend: "all time" },
    { label: "Completed Orders", val: stats.completed_orders || 0, trend: "successfully done" },
  ] : [];

  const DashboardSection = () => (
    <>
      <div className="stat-grid">
        {STATS_CARDS.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.val.toLocaleString()}</div>
            <div className="stat-trend up">{s.trend}</div>
          </div>
        ))}
      </div>
      <div className="admin-bottom-grid">
        <div className="card admin-table-card">
          <div className="card-header">
            <div>
              <div className="card-title">Pending Provider Requests</div>
              {pendingCount > 0 && <div style={{ fontSize: ".75rem", color: "#f59e0b", marginTop: 2 }}>{pendingCount} awaiting review</div>}
            </div>
            <button className="card-action" onClick={fetchData}>↻ Refresh</button>
          </div>
          {providers.filter(p => p.status === "pending").length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No pending requests.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Business</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {providers.filter(p => p.status === "pending").map(p => (
                    <tr key={p.id}>
                      <td>{p.full_name}</td><td>{p.business_name}</td><td>{p.phone}</td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td><span className={`badge ${statusCls[p.status] || "badge-pending"}`}>{p.status}</span></td>
                      <td><button className="btn-approve" onClick={() => approveProvider(p.id)} disabled={updatingId === p.id}>{updatingId === p.id ? "…" : "Approve"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card admin-table-card">
          <div className="card-header"><div><div className="card-title">Recent Users</div></div></div>
          {users.length === 0 ? (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No users found.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Phone</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {users.slice(0, 8).map(u => (
                    <tr key={u.id}>
                      <td>{u.full_name}</td><td>{u.phone}</td>
                      <td><span className={`badge ${u.role === "provider" ? "badge-progress" : "badge-accepted"}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.is_suspended ? "badge-rejected" : "badge-done"}`}>{u.is_suspended ? "Suspended" : "Active"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const UsersSection = () => (
    <div className="card admin-table-card" style={{ marginTop: "1rem" }}>
      <div className="card-header">
        <div className="card-title">All Users ({users.length})</div>
        <button className="card-action" onClick={fetchData}>↻ Refresh</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.full_name || "—"}</td><td>{u.phone}</td><td>{u.email || "—"}</td>
                <td><span className={`badge ${u.role === "provider" ? "badge-progress" : "badge-accepted"}`}>{u.role}</span></td>
                <td><span className={`badge ${u.is_suspended ? "badge-rejected" : "badge-done"}`}>{u.is_suspended ? "Suspended" : "Active"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProvidersSection = () => (
    <div className="card admin-table-card" style={{ marginTop: "1rem" }}>
      <div className="card-header">
        <div className="card-title">All Providers</div>
        <button className="card-action" onClick={fetchData}>↻ Refresh</button>
      </div>
      {providers.length === 0 ? (
        <div style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No providers found.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Business</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {providers.map(p => (
                <tr key={p.id}>
                  <td>{p.full_name || "—"}</td><td>{p.business_name}</td><td>{p.phone}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td><span className={`badge ${statusCls[p.status] || "badge-pending"}`}>{p.status}</span></td>
                  <td>{p.status === "pending" && <button className="btn-approve" onClick={() => approveProvider(p.id)} disabled={updatingId === p.id}>{updatingId === p.id ? "…" : "Approve"}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const SettingsSection = () => (
    <div className="card" style={{ marginTop: "1rem", padding: "2rem" }}>
      <div className="card-title" style={{ marginBottom: "1rem" }}>Platform Settings</div>
      <div style={{ color: "#6B7280" }}>Settings panel coming soon.</div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: "#6B7280" }}>Loading…</div>;
    if (error) return <div style={{ padding: "2rem", textAlign: "center" }}><p style={{ color: "#ef4444" }}>{error}</p><button className="btn-primary" onClick={fetchData}>Retry</button></div>;
    switch (activeNav) {
      case "Dashboard": return <DashboardSection />;
      case "Users":     return <UsersSection />;
      case "Providers": return <ProvidersSection />;
      case "Settings":  return <SettingsSection />;
      default:          return <DashboardSection />;
    }
  };

  return (
    <div className="ad-shell">
      <aside className="sidebar ad-sidebar">
        <div className="sidebar-logo">حيّك<span>.</span></div>
        <nav className="ad-nav" style={{ padding: "1.1rem 0", flex: 1 }}>
          {NAV.map(n => (
            <div key={n.label} className={`sidebar-item ${activeNav === n.label ? "active" : ""}`} onClick={() => setActiveNav(n.label)} style={{ cursor: "pointer" }}>
              <span className="sidebar-icon">{n.icon}</span>{n.label}
              {n.badge > 0 && <span className="sidebar-badge">{n.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-item" onClick={handleLogout} style={{ cursor: "pointer", color: "rgba(255,100,100,0.75)" }}>
            <span className="sidebar-icon">🚪</span> Logout
          </div>
        </div>
      </aside>
      <main className="ad-main">
        <div className="ad-topbar">
          <div className="ad-topbar-title">{activeNav}</div>
          <div className="ad-topbar-r">
            <div className="notif-btn">🔔{pendingCount > 0 && <span className="notif-dot" />}</div>
            <div style={{ fontSize: ".82rem", color: "#6B7280", fontWeight: 600 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
        <div className="ad-content">{renderContent()}</div>
      </main>
    </div>
  );
}

export default AdminDashboard;