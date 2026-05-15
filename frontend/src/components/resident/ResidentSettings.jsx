import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./ResidentSettings.css";

export default function ResidentSettings() {
  const navigate = useNavigate();
  const { logout, updateProfile, isLoading } = useAuth();

  const [notif, setNotif] = useState({ orders: true, promotions: false, reminders: true });
  const [lang, setLang] = useState("en");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setError("");
    try {
      await updateProfile({ notification_preferences: notif, language: lang });
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    } catch (err) {
      setError(err.message || "Failed to save settings.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="rs-root">
      <header className="rs-header">
        <button className="rs-back" onClick={() => navigate("/resident")}>← Back</button>
        <span className="rs-title">Settings</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="rs-container">
        {error && <div style={{ color: "#ef4444", background: "#fee2e2", padding: "10px 16px", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.85rem" }}>⚠️ {error}</div>}

        {/* Account */}
        <section className="rs-section">
          <h2>Account</h2>
          <button className="rs-row-btn" onClick={() => navigate("/resident/profile")}>
            <span>👤 Edit Profile</span><span className="rs-arrow">→</span>
          </button>
          <button className="rs-row-btn" disabled>
            <span>🔑 Change Password</span><span className="rs-arrow">→</span>
          </button>
        </section>

        {/* Notifications */}
        <section className="rs-section">
          <h2>Notifications</h2>
          {[
            { key: "orders", label: "Order Updates", desc: "Status changes on your orders" },
            { key: "promotions", label: "Promotions", desc: "Deals and discounts from providers" },
            { key: "reminders", label: "Reminders", desc: "Upcoming appointment reminders" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="rs-toggle-row">
              <div>
                <p className="rs-toggle-label">{label}</p>
                <p className="rs-toggle-desc">{desc}</p>
              </div>
              <button
                className={`rs-toggle ${notif[key] ? "on" : ""}`}
                onClick={() => setNotif({ ...notif, [key]: !notif[key] })}
                aria-label={label}
              >
                <span className="rs-toggle-knob" />
              </button>
            </div>
          ))}
        </section>

        {/* Language */}
        <section className="rs-section">
          <h2>Language</h2>
          <div className="rs-lang-row">
            {["en", "ar"].map(l => (
              <button
                key={l}
                className={`rs-lang-btn ${lang === l ? "active" : ""}`}
                onClick={() => setLang(l)}
              >
                {l === "en" ? "🇬🇧 English" : "🇸🇦 العربية"}
              </button>
            ))}
          </div>
        </section>

        {/* Danger */}
        <section className="rs-section">
          <h2>Account Actions</h2>
          <button className="rs-row-btn rs-danger" onClick={handleLogout}>
            <span>🚪 Logout</span><span className="rs-arrow">→</span>
          </button>
        </section>

        <button className="rs-save-btn" onClick={save} disabled={isLoading}>
          {isLoading ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {toast && <div className="rs-toast">Settings saved ✓</div>}
    </div>
  );
}
