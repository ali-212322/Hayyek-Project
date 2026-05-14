// frontend/src/components/resident/ResidentSettings.jsx
import React, { useState } from "react";
import "./ResidentSettings.css";

export default function ResidentSettings({ onBack }) {
  const [notif, setNotif] = useState({ orders: true, promotions: false, reminders: true });
  const [lang, setLang] = useState("en");
  const [toast, setToast] = useState(false);

  const save = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="rs-root">
      <header className="rs-header">
        <button className="rs-back" onClick={onBack}>← Back</button>
        <span className="rs-title">Settings</span>
        <div style={{ width: 60 }} />
      </header>

      <div className="rs-container">
        {/* Account */}
        <section className="rs-section">
          <h2>Account</h2>
          <button className="rs-row-btn">
            <span>🔑 Change Password</span><span className="rs-arrow">→</span>
          </button>
          <button className="rs-row-btn">
            <span>📧 Update Email</span><span className="rs-arrow">→</span>
          </button>
          <button className="rs-row-btn">
            <span>📱 Update Phone</span><span className="rs-arrow">→</span>
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
            {["en", "ar"].map((l) => (
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
          <button className="rs-row-btn rs-danger">
            <span>🗑️ Delete Account</span><span className="rs-arrow">→</span>
          </button>
        </section>

        <button className="rs-save-btn" onClick={save}>Save Changes</button>
      </div>

      {toast && <div className="rs-toast">Settings saved ✓</div>}
    </div>
  );
}
