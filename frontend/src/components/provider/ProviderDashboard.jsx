import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import C from "../../styles/colors";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

const STATUS_META = {
  pending: { label: "⏳ Pending", cls: "badge-pending" },
  accepted: { label: "✅ Accepted", cls: "badge-accepted" },
  in_progress: { label: "🔄 In Progress", cls: "badge-progress" },
  completed: { label: "✔ Completed", cls: "badge-done" },
  rejected: { label: "✗ Rejected", cls: "badge-rejected" },
  cancelled: { label: "✗ Cancelled", cls: "badge-rejected" },
};

function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [provider, setProvider] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [creatingService, setCreatingService] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    category: "",
    name: "",
    description: "",
    image_url: "",
    price: "",
    duration_minutes: 60,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const providerRes = await api.getMyProviderProfile().catch(() => null);
      const providerData = providerRes?.data || providerRes;

      if (providerData) setProvider(providerData);

      const [ordersRes, servicesRes, categoriesRes, reviewsRes] = await Promise.all([
        api.getOrders(),
        providerData?.id
          ? api.getMyServices(providerData.id).catch(() => ({ data: [] }))
          : Promise.resolve({ data: [] }),
        api.getCategories().catch(() => ({ data: [] })),
        api.getReviews().catch(() => ({ data: [] })),
      ]);

      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.results || []));
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : (servicesRes.data?.results || []));
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data?.results || []));
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : (reviewsRes.data?.results || []));
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const updateOrder = async (id, status) => {
    setUpdatingOrder(id);
    try {
      await api.updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert(err.message || "Failed to update order.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();

    if (!serviceForm.name || !serviceForm.price) {
      alert("Please enter service name and price.");
      return;
    }

    setCreatingService(true);

    try {
      const payload = {
        ...serviceForm,
        category: serviceForm.category || null,
        image_url: serviceForm.image_url || null,
        price: Number(serviceForm.price),
        duration_minutes: Number(serviceForm.duration_minutes || 60),
      };

      const res = await api.createService(payload);
      const newService = res?.data || res;

      setServices(prev => [newService, ...prev]);

      setServiceForm({
        category: "",
        name: "",
        description: "",
        image_url: "",
        price: "",
        duration_minutes: 60,
      });

      alert("Service added successfully.");
    } catch (err) {
      alert(err.message || "Failed to create service.");
    } finally {
      setCreatingService(false);
    }
  };

  const toggleAvailability = async () => {
    if (!provider) return;
    try {
      await api.updateProviderProfile({ is_available: !provider.is_available });
      setProvider(p => ({ ...p, is_available: !p.is_available }));
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const pendingCount = orders.filter(o => o.status === "pending").length;
  const displayName = provider?.business_name || user?.full_name || "Provider";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const NAV = [
    { icon: "📊", label: "Dashboard" },
    { icon: "📋", label: "Orders", badge: pendingCount || null, path: "/provider/orders" },
    { icon: "💰", label: "Earnings", path: "/provider/earnings" },
    { icon: "⭐", label: "Reviews", path: "/provider/reviews" },
    { icon: "⚙️", label: "Settings", path: "/provider/settings" },
  ];

  const handleNav = (item) => {
    if (item.path) navigate(item.path);
    else setActiveNav(item.label);
  };

  const recentOrders = orders.slice(0, 4);
  const recentReviews = reviews.slice(0, 2);

  return (
    <div className="pd-shell">
      <aside className="sidebar pd-sidebar">
        <div className="sidebar-logo">حيّك<span>.</span></div>

        <div className="sidebar-provider-info">
          <div className="sidebar-ava" style={{ background: C.gf, color: C.gd }}>{initials}</div>
          <div style={{ fontSize: ".84rem", fontWeight: 700, color: "#fff" }}>{displayName}</div>
          <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.45)", marginTop: ".1rem" }}>
            <span className="pd-online-dot" />
            {provider?.is_available ? "Available" : "Busy"}
          </div>
        </div>

        <nav className="pd-nav" style={{ padding: "1.1rem 0", flex: 1 }}>
          {NAV.map(n => (
            <div key={n.label} className={`sidebar-item ${activeNav === n.label ? "active" : ""}`} onClick={() => handleNav(n)} style={{ cursor: "pointer" }}>
              <span className="sidebar-icon">{n.icon}</span>
              {n.label}
              {n.badge ? <span className="sidebar-badge">{n.badge}</span> : null}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avail-row">
            <div className={`toggle-switch ${provider?.is_available ? "on" : "off"}`} onClick={toggleAvailability} />
            <span style={{ fontSize: ".78rem", color: "rgba(255,255,255,.65)" }}>
              {provider?.is_available ? "I'm Available" : "Set as Busy"}
            </span>
          </div>
          <div className="sidebar-item" onClick={handleLogout} style={{ cursor: "pointer", marginTop: "8px", color: "rgba(255,100,100,0.75)" }}>
            <span className="sidebar-icon">🚪</span> Logout
          </div>
        </div>
      </aside>

      <main className="pd-main">
        <div className="pd-topbar">
          <div className="pd-topbar-title">Provider Dashboard</div>
        </div>

        {loading && <div style={{ padding: "2rem", textAlign: "center", color: C.muted }}>Loading dashboard…</div>}
        {!loading && error && <div style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>{error}</div>}

        {!loading && !error && (
          <div className="pd-content">
            <div className="kpi-grid">
              {[
                { icon: "📦", label: "Total Orders", val: orders.length, change: `${pendingCount} pending` },
                { icon: "✅", label: "Completed", val: orders.filter(o => o.status === "completed").length, change: "orders done" },
                { icon: "⭐", label: "Avg. Rating", val: provider?.avg_rating ? Number(provider.avg_rating).toFixed(1) : "—", change: `${reviews.length} reviews` },
                { icon: "📋", label: "Pending", val: pendingCount, change: "need action" },
              ].map(k => (
                <div key={k.label} className="kpi-card">
                  <div className="kpi-icon">{k.icon}</div>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-val">{k.val}</div>
                  <div className="kpi-change">{k.change}</div>
                </div>
              ))}
            </div>

            <div className="pd-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Add New Service</div>
                      <div style={{ fontSize: ".75rem", color: C.muted, marginTop: "2px" }}>
                        Add services that belong only to your provider account.
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCreateService} style={{ padding: "1.2rem 1.5rem", display: "grid", gap: "12px" }}>
                    <input type="text" placeholder="Service name" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ddd" }} />

                    <textarea placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ddd", minHeight: "80px" }} />

                    <input type="url" placeholder="Image URL" value={serviceForm.image_url} onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ddd" }} />

                    <select value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ddd" }}>
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name_en || cat.name_ar}</option>
                      ))}
                    </select>

                    <input type="number" placeholder="Price" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ddd" }} />

                    <input type="number" placeholder="Duration in minutes" value={serviceForm.duration_minutes} onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: e.target.value })} style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ddd" }} />

                    <button className="btn-primary" type="submit" disabled={creatingService}>
                      {creatingService ? "Adding..." : "Add Service"}
                    </button>
                  </form>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div><div className="card-title">My Services</div></div>
                  </div>

                  {services.length === 0 ? (
                    <div style={{ padding: "1.5rem", textAlign: "center", color: C.muted }}>No services added yet.</div>
                  ) : (
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Service</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map(s => (
                            <tr key={s.id}>
                              <td>
                                {s.image_url ? (
                                  <img src={s.image_url} alt={s.name} style={{ width: "54px", height: "40px", objectFit: "cover", borderRadius: "8px" }} />
                                ) : "—"}
                              </td>
                              <td>{s.name}</td>
                              <td>{s.category_name || "—"}</td>
                              <td>SAR {s.price}</td>
                              <td>
                                <span className={`badge ${s.is_active ? "badge-approved" : "badge-suspend"}`}>
                                  {s.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="card">
                  <div className="card-header">
                    <div><div className="card-title">Recent Orders</div></div>
                    <button className="card-action" onClick={() => navigate("/provider/orders")}>View all →</button>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div style={{ padding: "1.5rem", textAlign: "center", color: C.muted }}>No orders yet.</div>
                  ) : (
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr><th>Order</th><th>Service</th><th>Status</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                          {recentOrders.map(o => {
                            const meta = STATUS_META[o.status] || { label: o.status, cls: "badge-pending" };
                            return (
                              <tr key={o.id}>
                                <td>#{o.order_number || o.id}</td>
                                <td>{o.service_name || "—"}</td>
                                <td><span className={`badge ${meta.cls}`}>{meta.label}</span></td>
                                <td>
                                  {o.status === "pending" && (
                                    <div className="action-btns">
                                      <button className="btn-accept" onClick={() => updateOrder(o.id, "accepted")} disabled={updatingOrder === o.id}>Accept</button>
                                      <button className="btn-reject" onClick={() => updateOrder(o.id, "rejected")} disabled={updatingOrder === o.id}>Reject</button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="card" style={{ padding: "1.2rem 1.5rem" }}>
                  <div className="card-title" style={{ marginBottom: "12px" }}>Quick Links</div>
                  <button className="btn-ghost" onClick={() => navigate("/provider/profile")}>👤 My Profile →</button>
                  <button className="btn-ghost" onClick={() => navigate("/provider/earnings")}>💰 Earnings →</button>
                  <button className="btn-ghost" onClick={() => navigate("/provider/settings")}>⚙️ Settings →</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProviderDashboard;