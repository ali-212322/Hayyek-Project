import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./ResidentProfile.css";

export default function ResidentProfile() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading } = useAuth();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setError("");
    if (!form.full_name.trim()) { setError("Full name is required."); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Enter a valid email."); return; }
    try {
      await updateProfile({ full_name: form.full_name, email: form.email });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    }
  };

  const getInitials = (name) => (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rp-root">
      <header className="rp-header">
        <button className="rp-back" onClick={() => navigate("/resident")}>← Back</button>
        <span className="rp-title">My Profile</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="rp-container">
        {/* Avatar card */}
        <div className="rp-avatar-card">
          <div className="rp-avatar">{getInitials(user?.full_name)}</div>
          <h2>{user?.full_name || "—"}</h2>
          <p className="rp-join">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}</p>
          <div className="rp-stats">
            <div className="rp-stat">
              <span className="rp-stat-num">{user?.role || "resident"}</span>
              <span className="rp-stat-label">Account Type</span>
            </div>
            <div className="rp-stat-div" />
            <div className="rp-stat">
              <span className="rp-stat-num">{user?.is_phone_verified ? "✓" : "✗"}</span>
              <span className="rp-stat-label">Phone Verified</span>
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
                <button className="rp-cancel-btn" onClick={() => { setEditing(false); setError(""); if (user) setForm({ full_name: user.full_name || "", email: user.email || "", phone: user.phone || "" }); }}>Cancel</button>
                <button className="rp-save-btn" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving…" : "Save"}</button>
              </div>
            )}
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "8px" }}>⚠️ {error}</div>}

          {[
            { label: "Full Name", key: "full_name", icon: "👤", editable: true },
            { label: "Email", key: "email", icon: "📧", editable: true },
            { label: "Phone", key: "phone", icon: "📱", editable: false },
          ].map(({ label, key, icon, editable }) => (
            <div key={key} className="rp-field">
              <label>{icon} {label}</label>
              {editing && editable ? (
                <input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              ) : (
                <p>{form[key] || "—"}{!editable && editing && <span style={{ fontSize: "0.75rem", color: "#9ca3af", marginLeft: "8px" }}>(cannot change)</span>}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="rp-quick">
          {[
            { icon: "📦", label: "My Orders", path: "/resident/orders" },
            { icon: "⚙️", label: "Settings", path: "/resident/settings" },
            { icon: "🏠", label: "Browse Services", path: "/resident" },
          ].map(({ icon, label, path }) => (
            <button key={path} className="rp-quick-btn" onClick={() => navigate(path)}>
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
