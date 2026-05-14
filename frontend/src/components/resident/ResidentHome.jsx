// frontend/src/components/resident/ResidentHome.jsx
import React, { useState } from "react";
import { PROVIDERS, CATEGORIES, addOrder, STATUS_COLORS } from "../shared/providers";
import "./ResidentHome.css";

const MOCK_RESIDENT = { id: "user-1", name: "Mohammed Al-Rashid", address: "Villa 14, Al Olaya, Riyadh" };

export default function ResidentHome({ onNavigate, onBack }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [orderForm, setOrderForm] = useState({ service: "", notes: "", address: MOCK_RESIDENT.address });
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const categories = ["All", ...CATEGORIES];

  const filtered = PROVIDERS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      p.shopName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOrder = () => {
    if (!orderForm.service.trim()) return showToast("Please describe the service needed.", "error");
    addOrder({
      residentId: MOCK_RESIDENT.id,
      providerId: selectedProvider.id,
      providerName: selectedProvider.shopName,
      category: selectedProvider.category,
      service: orderForm.service,
      address: orderForm.address,
      notes: orderForm.notes,
      price: selectedProvider.basePrice,
    });
    showToast(`Order placed with ${selectedProvider.shopName}! ✓`);
    setSelectedProvider(null);
    setOrderForm({ service: "", notes: "", address: MOCK_RESIDENT.address });
  };

  return (
    <div className="rh-root">
      {/* ── Header ── */}
      <header className="rh-header">
        <div className="rh-header-inner">
          <div className="rh-brand">
            <span className="rh-logo">حيّك</span>
            <span className="rh-tagline">Neighborhood Services</span>
          </div>
          <nav className="rh-nav">
            <button onClick={() => onNavigate("orders")} className="rh-nav-btn">My Orders</button>
            <button onClick={() => onNavigate("profile")} className="rh-nav-btn">Profile</button>
            <button onClick={() => onNavigate("settings")} className="rh-nav-btn">Settings</button>
            <button onClick={onBack} className="rh-nav-btn rh-nav-logout">Logout</button>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="rh-hero">
        <h1>Find a Trusted<br /><span>Service Provider</span></h1>
        <div className="rh-search-wrap">
          <span className="rh-search-icon">🔍</span>
          <input
            className="rh-search"
            placeholder="Search services or providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <div className="rh-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`rh-cat-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "All" && "🏷️ "}
            {cat === "Cleaning" && "🧹 "}
            {cat === "AC Repair & Service" && "❄️ "}
            {cat === "General Maintenance" && "🔧 "}
            {cat}
          </button>
        ))}
      </div>

      {/* ── Shops / Provider Cards ── */}
      <main className="rh-grid">
        {filtered.length === 0 && (
          <div className="rh-empty">No providers found for "{search}"</div>
        )}
        {filtered.map((p) => (
          <article key={p.id} className={`rh-card ${!p.available ? "rh-card-unavailable" : ""}`}>
            <div className="rh-card-avatar">{p.avatar}</div>
            <div className="rh-card-body">
              <div className="rh-card-top">
                <h3>{p.shopName}</h3>
                <span className={`rh-avail ${p.available ? "avail" : "unavail"}`}>
                  {p.available ? "Available" : "Busy"}
                </span>
              </div>
              <p className="rh-card-owner">👤 {p.ownerName}</p>
              <p className="rh-card-loc">📍 {p.location}</p>
              <p className="rh-card-desc">{p.description}</p>
              <div className="rh-card-tags">
                {p.tags.map((t) => <span key={t} className="rh-tag">{t}</span>)}
              </div>
              <div className="rh-card-footer">
                <span className="rh-rating">⭐ {p.rating} ({p.reviewCount})</span>
                <span className="rh-price">{p.priceRange}</span>
              </div>
            </div>
            {p.available && (
              <button className="rh-order-btn" onClick={() => setSelectedProvider(p)}>
                Book Now →
              </button>
            )}
          </article>
        ))}
      </main>

      {/* ── Order Modal ── */}
      {selectedProvider && (
        <div className="rh-modal-backdrop" onClick={() => setSelectedProvider(null)}>
          <div className="rh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="rh-modal-close" onClick={() => setSelectedProvider(null)}>✕</button>
            <div className="rh-modal-header">
              <span className="rh-modal-avatar">{selectedProvider.avatar}</span>
              <div>
                <h2>{selectedProvider.shopName}</h2>
                <p>{selectedProvider.category}</p>
              </div>
            </div>
            <div className="rh-modal-body">
              <label>Service Needed *</label>
              <input
                placeholder="e.g. AC gas recharge, deep kitchen clean..."
                value={orderForm.service}
                onChange={(e) => setOrderForm({ ...orderForm, service: e.target.value })}
              />
              <label>Your Address</label>
              <input
                value={orderForm.address}
                onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
              />
              <label>Additional Notes</label>
              <textarea
                placeholder="Any special instructions..."
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                rows={3}
              />
              <div className="rh-modal-price">
                Starting from <strong>{selectedProvider.priceRange}</strong>
              </div>
              <button className="rh-confirm-btn" onClick={handleOrder}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`rh-toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
