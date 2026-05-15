import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

export default function ProviderProfile() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading } = useAuth();

  const [provider, setProvider] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ business_name: "", description: "", neighborhood: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getMyProviderProfile();
        const data = res.data || res;
        setProvider(data);
        setForm({
          business_name: data.business_name || "",
          description: data.description || "",
          neighborhood: data.neighborhood || "",
        });
      } catch (err) {
        setError("Failed to load provider profile.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setError("");
    if (!form.business_name.trim()) { setError("Business name is required."); return; }
    try {
      const res = await api.updateProviderProfile(form);
      const updated = res.data || res;
      setProvider(updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    }
  };

  const getInitials = name => (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  if (loadingData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf8" }}>
        <p style={{ color: "#2D6A4F" }}>Loading profile…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" }}>
      <header style={{ background: "#2D6A4F", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/provider")} style={{ background: "none", border: "none", color: "#fff", fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>Provider Profile</span>
      </header>

      <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 20px 60px", display: "flex", flexDirection: "column", gap: 20 }}>
        {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "10px" }}>⚠️ {error}</div>}

        {/* Profile card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "28px", textAlign: "center", boxShadow: "0 4px 16px rgba(45,106,79,0.09)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#d8f3dc", color: "#2D6A4F", fontSize: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            {getInitials(provider?.business_name || user?.full_name)}
          </div>
          <h2 style={{ margin: 0, color: "#1a1a1a" }}>{provider?.business_name || "—"}</h2>
          <p style={{ color: "#6b7280", margin: "4px 0" }}>{provider?.neighborhood}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, color: "#2D6A4F" }}>{provider?.avg_rating ? Number(provider.avg_rating).toFixed(1) : "—"}</div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Rating</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, color: "#2D6A4F" }}>{provider?.total_orders || 0}</div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Orders</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, color: provider?.status === "approved" ? "#2D6A4F" : "#f59e0b" }}>{provider?.status || "—"}</div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Status</div>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 4px 12px rgba(45,106,79,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Business Information</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} style={{ background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontWeight: 600 }}>Edit</button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setEditing(false); setError(""); }} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleSave} disabled={isLoading} style={{ background: "#2D6A4F", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontWeight: 600 }}>{isLoading ? "Saving…" : "Save"}</button>
              </div>
            )}
          </div>

          {[
            { label: "Business Name", key: "business_name" },
            { label: "Neighborhood", key: "neighborhood" },
            { label: "Description", key: "description", multiline: true },
          ].map(({ label, key, multiline }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>{label}</label>
              {editing ? (
                multiline ? (
                  <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} rows={3} style={{ width: "100%", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: "0.9rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                ) : (
                  <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", border: "1.5px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                )
              ) : (
                <p style={{ margin: 0, color: provider?.[key] ? "#1a1a1a" : "#9ca3af" }}>{provider?.[key] || "—"}</p>
              )}
            </div>
          ))}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Phone</label>
            <p style={{ margin: 0 }}>{provider?.phone || user?.phone || "—"}</p>
          </div>
        </div>

        {saved && (
          <div style={{ background: "#d8f3dc", color: "#2D6A4F", padding: "12px 16px", borderRadius: 10, textAlign: "center", fontWeight: 600 }}>
            Profile saved ✓
          </div>
        )}
      </div>
    </div>
  );
}
