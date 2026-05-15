import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

function ProviderSettings() {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isLoading } = useAuth();

  const [form, setForm] = useState({ full_name: "", email: "" });
  const [providerForm, setProviderForm] = useState({ business_name: "", neighborhood: "", description: "" });
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) setForm({ full_name: user.full_name || "", email: user.email || "" });
  }, [user]);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.getMyProviderProfile();
        const data = res.data || res;
        setProviderForm({
          business_name: data.business_name || "",
          neighborhood: data.neighborhood || "",
          description: data.description || "",
        });
      } catch {
        // ok if not loaded
      } finally {
        setLoadingData(false);
      }
    };
    fetchProvider();
  }, []);

  const saveUserSettings = async () => {
    setError("");
    if (!form.full_name.trim()) { setError("Full name is required."); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Enter a valid email address."); return; }
    try {
      await updateProfile({ full_name: form.full_name, email: form.email });
      setToast("Account settings saved ✓");
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setError(err.message || "Failed to save settings.");
    }
  };

  const saveProviderSettings = async () => {
    setError("");
    if (!providerForm.business_name.trim()) { setError("Business name is required."); return; }
    try {
      await api.updateProviderProfile(providerForm);
      setToast("Provider settings saved ✓");
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setError(err.message || "Failed to save provider settings.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "#2D6A4F", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/provider")} style={{ background: "none", border: "none", color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Settings</span>
      </header>

      <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 20px 60px", display: "flex", flexDirection: "column", gap: 20 }}>
        {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "10px" }}>⚠️ {error}</div>}

        {/* Account settings */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
          <h3 style={{ margin: "0 0 16px", color: "#1a1a1a" }}>Account Settings</h3>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Full Name</label>
            <input
              className="input"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Phone</label>
            <input className="input" value={user?.phone || ""} disabled style={{ background: "#f9fafb", color: "#9ca3af" }} />
          </div>
          <button className="btn-primary" onClick={saveUserSettings} disabled={isLoading}>{isLoading ? "Saving…" : "Save Account Settings"}</button>
        </div>

        {/* Provider settings */}
        {!loadingData && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
            <h3 style={{ margin: "0 0 16px", color: "#1a1a1a" }}>Business Settings</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Business Name</label>
              <input
                className="input"
                value={providerForm.business_name}
                onChange={e => setProviderForm({ ...providerForm, business_name: e.target.value })}
                placeholder="Your business name"
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Neighborhood</label>
              <input
                className="input"
                value={providerForm.neighborhood}
                onChange={e => setProviderForm({ ...providerForm, neighborhood: e.target.value })}
                placeholder="Your service area"
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Description</label>
              <textarea
                className="input"
                value={providerForm.description}
                onChange={e => setProviderForm({ ...providerForm, description: e.target.value })}
                placeholder="Describe your services"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            <button className="btn-primary" onClick={saveProviderSettings} disabled={isLoading}>{isLoading ? "Saving…" : "Save Business Settings"}</button>
          </div>
        )}

        {/* Danger zone */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
          <h3 style={{ margin: "0 0 16px", color: "#1a1a1a" }}>Account Actions</h3>
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "1.5px solid #ef4444", color: "#ef4444", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600, width: "100%" }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", background: "#2D6A4F", color: "#fff", padding: "12px 24px", borderRadius: 12, fontWeight: 600, zIndex: 1000 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default ProviderSettings;
