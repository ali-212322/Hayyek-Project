// frontend/src/components/resident/ResidentProfile.jsx
import React, { useState } from "react";
import "./ResidentProfile.css";

const MOCK_RESIDENT = {
  id: "user-1",
  name: "Mohammed Al-Rashid",
  email: "m.rashid@email.com",
  phone: "+966 55 123 4567",
  address: "Villa 14, Al Olaya, Riyadh",
  avatar: "👤",
  joinDate: "January 2024",
  totalOrders: 12,
  completedOrders: 10,
};

export default function ResidentProfile({ onNavigate, onBack }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...MOCK_RESIDENT });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="rp-root">
      <header className="rp-header">
        <button className="rp-back" onClick={onBack}>← Back</button>
        <span className="rp-title">My Profile</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="rp-container">
        {/* Avatar card */}
        <div className="rp-avatar-card">
          <div className="rp-avatar">{form.avatar}</div>
          <h2>{form.name}</h2>
          <p className="rp-join">Member since {MOCK_RESIDENT.joinDate}</p>
          <div className="rp-stats">
            <div className="rp-stat">
              <span className="rp-stat-num">{MOCK_RESIDENT.totalOrders}</span>
              <span className="rp-stat-label">Total Orders</span>
            </div>
            <div className="rp-stat-div" />
            <div className="rp-stat">
              <span className="rp-stat-num">{MOCK_RESIDENT.completedOrders}</span>
              <span className="rp-stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="rp-info-card">
          <div className="rp-info-header">
            <h3>Personal Information</h3>
            {!editing ? (
              <button className="rp-edit-btn" onClick={() => setEditing(true)}>Edit</button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="rp-cancel-btn" onClick={() => { setEditing(false); setForm({ ...MOCK_RESIDENT }); }}>Cancel</button>
                <button className="rp-save-btn" onClick={handleSave}>Save</button>
              </div>
            )}
          </div>

          {[
            { label: "Full Name", key: "name", icon: "👤" },
            { label: "Email", key: "email", icon: "📧" },
            { label: "Phone", key: "phone", icon: "📱" },
            { label: "Address", key: "address", icon: "📍" },
          ].map(({ label, key, icon }) => (
            <div key={key} className="rp-field">
              <label>{icon} {label}</label>
              {editing ? (
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ) : (
                <p>{form[key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="rp-quick">
          {[
            { icon: "📦", label: "My Orders", view: "orders" },
            { icon: "⚙️", label: "Settings", view: "settings" },
            { icon: "🏠", label: "Browse Services", view: "home" },
          ].map(({ icon, label, view }) => (
            <button key={view} className="rp-quick-btn" onClick={() => onNavigate(view)}>
              <span>{icon}</span>
              <span>{label}</span>
              <span className="rp-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      {saved && <div className="rp-toast">Profile saved ✓</div>}
    </div>
  );
}
