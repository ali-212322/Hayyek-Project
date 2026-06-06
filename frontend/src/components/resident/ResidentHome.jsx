import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import "./ResidentHome.css";

const MAP_CENTER = { lat: 24.7136, lng: 46.6753 };

export default function ResidentHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [orderForm, setOrderForm] = useState({
    notes: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [markerPos, setMarkerPos] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [servicesRes, categoriesRes] = await Promise.all([
          api.getServices(),
          api.getCategories(),
        ]);

        const servicesList = Array.isArray(servicesRes.data)
          ? servicesRes.data
          : servicesRes.data?.results || [];

        const categoriesList = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : categoriesRes.data?.results || [];

        setServices(servicesList);
        setCategories(categoriesList);
      } catch (err) {
        setError("Failed to load services. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user?.address) {
      setOrderForm((f) => ({ ...f, address: user.address }));
    }
  }, [user]);

  const onMapClick = useCallback((e) => {
    const lat = parseFloat(e.latLng.lat().toFixed(6));
    const lng = parseFloat(e.latLng.lng().toFixed(6));

    setMarkerPos({ lat, lng });
    setOrderForm((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: lat + ", " + lng,
    }));
  }, []);

  const categoryNames = [
    "All",
    ...categories.map((c) => c.name_en || c.name_ar || c.name),
  ];

  const filtered = services.filter((s) => {
    const matchCat =
      activeCategory === "All" || s.category_name === activeCategory;

    const q = search.toLowerCase();

    const matchSearch =
      (s.name || "").toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q) ||
      (s.provider_name || "").toLowerCase().includes(q) ||
      (s.category_name || "").toLowerCase().includes(q);

    return matchCat && matchSearch && s.is_active !== false;
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOrder = async () => {
    if (!selectedService) return;

    if (!markerPos) {
      showToast("Please select your location on the map.", "error");
      return;
    }

    setOrderLoading(true);

    try {
      await api.createOrder({
        service: selectedService.id,
        service_id: selectedService.id,
        provider: selectedService.provider,
        notes: orderForm.notes,
        address: orderForm.address,
        latitude: orderForm.latitude,
        longitude: orderForm.longitude,
      });

      showToast("Order placed for " + selectedService.name + "!");
      setSelectedService(null);
      setMarkerPos(null);
      setOrderForm({
        notes: "",
        address: "",
        latitude: null,
        longitude: null,
      });
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

  const getInitials = (name) =>
    (name || "?")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="rh-root">
      <header className="rh-header">
        <div className="rh-header-inner">
          <div className="rh-brand">
            <span className="rh-logo">حيك</span>
            <span className="rh-tagline">Neighborhood Services</span>
          </div>

          <nav className="rh-nav">
            <button
              onClick={() => navigate("/resident/orders")}
              className="rh-nav-btn"
            >
              My Orders
            </button>
            <button
              onClick={() => navigate("/resident/profile")}
              className="rh-nav-btn"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/resident/settings")}
              className="rh-nav-btn"
            >
              Settings
            </button>
            <button onClick={handleLogout} className="rh-nav-btn rh-nav-logout">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <section className="rh-hero">
        <h1>
          {user && user.full_name
            ? "Welcome, " + user.full_name.split(" ")[0]
            : "Find a Trusted"}
          <br />
          <span>Service</span>
        </h1>

        <div className="rh-search-wrap">
          <span className="rh-search-icon">Search</span>
          <input
            className="rh-search"
            placeholder="Search services, providers, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="rh-categories">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            className={"rh-cat-btn" + (activeCategory === cat ? " active" : "")}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="rh-grid">
        {loading && <div className="rh-empty">Loading services...</div>}

        {!loading && error && (
          <div className="rh-empty" style={{ color: "#ef4444" }}>
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rh-empty">
            {search
              ? "No services found for " + search
              : "No services available right now."}
          </div>
        )}

        {filtered.map((s) => (
          <article key={s.id} className="rh-card">
            <div className="rh-card-avatar">
              {s.image_url ? (
                <img
                  src={s.image_url}
                  alt={s.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "inherit",
                  }}
                />
              ) : (
                getInitials(s.name)
              )}
            </div>

            <div className="rh-card-body">
              <div className="rh-card-top">
                <h3>{s.name}</h3>
                <span className="rh-avail avail">Available</span>
              </div>

              {s.provider_name && (
                <p className="rh-card-owner">{s.provider_name}</p>
              )}

              {s.category_name && (
                <p className="rh-card-loc">{s.category_name}</p>
              )}

              {s.description && (
                <p className="rh-card-desc">{s.description}</p>
              )}

              <div className="rh-card-footer">
                <span className="rh-rating">
                  {s.duration_minutes || 60} min
                </span>
                <span className="rh-price">SAR {s.price}</span>
              </div>
            </div>

            <button
              className="rh-order-btn"
              onClick={() => setSelectedService(s)}
            >
              Book Service
            </button>
          </article>
        ))}
      </main>

      {selectedService && (
        <div
          className="rh-modal-backdrop"
          onClick={() => setSelectedService(null)}
        >
          <div className="rh-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="rh-modal-close"
              onClick={() => setSelectedService(null)}
            >
              X
            </button>

            <div className="rh-modal-header">
              <span className="rh-modal-avatar">
                {selectedService.image_url ? (
                  <img
                    src={selectedService.image_url}
                    alt={selectedService.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "inherit",
                    }}
                  />
                ) : (
                  getInitials(selectedService.name)
                )}
              </span>

              <div>
                <h2>{selectedService.name}</h2>
                <p>{selectedService.provider_name}</p>
              </div>
            </div>

            <div className="rh-modal-body">
              <label>Your Location (tap the map to select)</label>

              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "220px",
                    borderRadius: "10px",
                    marginBottom: "8px",
                  }}
                  center={markerPos || MAP_CENTER}
                  zoom={markerPos ? 15 : 11}
                  onClick={onMapClick}
                >
                  {markerPos && <Marker position={markerPos} />}
                </GoogleMap>
              ) : (
                <div
                  style={{
                    height: 220,
                    background: "#f3f4f6",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                    marginBottom: 8,
                  }}
                >
                  Loading map...
                </div>
              )}

              {markerPos && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    marginBottom: 8,
                  }}
                >
                  Location selected
                </p>
              )}

              <label>Additional Notes</label>
              <textarea
                placeholder="Describe what you need..."
                value={orderForm.notes}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, notes: e.target.value })
                }
                rows={3}
              />

              <div className="rh-modal-price">
                SAR {selectedService.price} ·{" "}
                {selectedService.duration_minutes || 60} min
              </div>

              <button
                className="rh-confirm-btn"
                onClick={handleOrder}
                disabled={orderLoading}
              >
                {orderLoading ? "Placing order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={"rh-toast " + toast.type}>{toast.msg}</div>}
    </div>
  );
}