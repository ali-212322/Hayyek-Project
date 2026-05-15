import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import "./ResidentHome.css";

const STATUS_COLORS = { pending: "#f59e0b", in_progress: "#3b82f6", completed: "#10b981", cancelled: "#ef4444" };

export default function ResidentHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [orderForm, setOrderForm] = useState({ notes: "", address: "" });
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [providersRes, categoriesRes] = await Promise.all([
          api.getProviders(),
          api.getCategories(),
        ]);
        const providersList = Array.isArray(providersRes.data) ? providersRes.data : (providersRes.data?.results || []);
        const categoriesList = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data?.results || []);
        setProviders(providersList);
        setCategories(categoriesList);
      } catch (err) {
        setError("Failed to load providers. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.address) setOrderForm(f => ({ ...f, address: user.address }));
  }, [user]);

  const categoryNames = ["All", ...categories.map(c => c.name)];

  const filtered = providers.filter(p => {
    const matchCat = activeCategory === "All" || p.category_name === activeCategory;
    const matchSearch =
      (p.business_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.neighborhood || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOrder = async () => {
    if (!orderForm.address.trim()) {
      showToast("Please enter your address.", "error");
      return;
    }
    setOrderLoading(true);
    try {
      await api.createOrder({
        provider: selectedProvider.id,
        notes: orderForm.notes,
        address: orderForm.address,
      });
      showToast(`Order placed with ${selectedProvider.business_name}! ✓`);
      setSelectedProvider(null);
      setOrderForm({ notes: "", address: user?.address || "" });
    } catch (err) {
      showToast(err.message || "Failed to place order.", "error");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rh-root">
      {/* Header */}
      <header className="rh-header">
        <div className="rh-header-inner">
          <div className="rh-brand">
            <span className="rh-logo">حيّك</span>
            <span className="rh-tagline">Neighborhood Services</span>
          </div>
          <nav className="rh-nav">
            <button onClick={() => navigate("/resident/orders")} className="rh-nav-btn">My Orders</button>
            <button onClick={() => navigate("/resident/profile")} className="rh-nav-btn">Profile</button>
            <button onClick={() => navigate("/resident/settings")} className="rh-nav-btn">Settings</button>
            <button onClick={handleLogout} className="rh-nav-btn rh-nav-logout">Logout</button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="rh-hero">
        <h1>
          {user?.full_name ? `Welcome, ${user.full_name.split(" ")[0]}` : "Find a Trusted"}
          <br /><span>Service Provider</span>
        </h1>
        <div className="rh-search-wrap">
          <span className="rh-search-icon">🔍</span>
          <input
            className="rh-search"
            placeholder="Search services or providers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Category Tabs */}
      <div className="rh-categories">
        {categoryNames.map(cat => (
          <button
            key={cat}
            className={`rh-cat-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Provider Cards */}
      <main className="rh-grid">
        {loading && <div className="rh-empty">Loading providers…</div>}
        {!loading && error && <div className="rh-empty" style={{ color: "#ef4444" }}>{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="rh-empty">
            {search ? `No providers found for "${search}"` : "No providers available right now."}
          </div>
        )}
        {filtered.map(p => (
          <article key={p.id} className={`rh-card ${!p.is_available ? "rh-card-unavailable" : ""}`}>
            <div className="rh-card-avatar">{p.logo ? <img src={p.logo} alt={p.business_name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} /> : getInitials(p.business_name)}</div>
            <div className="rh-card-body">
              <div className="rh-card-top">
                <h3>{p.business_name}</h3>
                <span className={`rh-avail ${p.is_available ? "avail" : "unavail"}`}>
                  {p.is_available ? "Available" : "Busy"}
                </span>
              </div>
              {p.full_name && <p className="rh-card-owner">👤 {p.full_name}</p>}
              {p.neighborhood && <p className="rh-card-loc">📍 {p.neighborhood}</p>}
              {p.description && <p className="rh-card-desc">{p.description}</p>}
              <div className="rh-card-footer">
                <span className="rh-rating">⭐ {p.avg_rating ? Number(p.avg_rating).toFixed(1) : "New"}</span>
                <span className="rh-price">{p.total_orders || 0} orders</span>
              </div>
            </div>
            {p.is_available && (
              <button className="rh-order-btn" onClick={() => setSelectedProvider(p)}>
                Book Now →
              </button>
            )}
          </article>
        ))}
      </main>

      {/* Order Modal */}
      {selectedProvider && (
        <div className="rh-modal-backdrop" onClick={() => setSelectedProvider(null)}>
          <div className="rh-modal" onClick={e => e.stopPropagation()}>
            <button className="rh-modal-close" onClick={() => setSelectedProvider(null)}>✕</button>
            <div className="rh-modal-header">
              <span className="rh-modal-avatar">{getInitials(selectedProvider.business_name)}</span>
              <div>
                <h2>{selectedProvider.business_name}</h2>
                <p>{selectedProvider.neighborhood}</p>
              </div>
            </div>
            <div className="rh-modal-body">
              <label>Your Address *</label>
              <input
                placeholder="Enter your address"
                value={orderForm.address}
                onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
              />
              <label>Additional Notes</label>
              <textarea
                placeholder="Describe what you need (e.g. AC gas recharge, deep kitchen clean)..."
                value={orderForm.notes}
                onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })}
                rows={3}
              />
              {selectedProvider.avg_rating && (
                <div className="rh-modal-price">
                  ⭐ {Number(selectedProvider.avg_rating).toFixed(1)} · {selectedProvider.total_orders || 0} orders completed
                </div>
              )}
              <button className="rh-confirm-btn" onClick={handleOrder} disabled={orderLoading}>
                {orderLoading ? "Placing order…" : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className={`rh-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
