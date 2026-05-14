// frontend/src/App.jsx
import React, { useState } from "react";

import Landing from "./components/landing/Landing";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

import ProviderDashboard from "./components/provider/ProviderDashboard";
import ProviderProfile from "./components/provider/ProviderProfile";
import ProviderSettings from "./components/provider/ProviderSettings";
import ProviderReviews from "./components/provider/ProviderReviews";
import ProviderEarnings from "./components/provider/ProviderEarnings";
import ProviderOrders from "./components/provider/ProviderOrders";      // NEW

import AdminDashboard from "./components/admin/AdminDashboard";

import ResidentHome from "./components/resident/ResidentHome";           // NEW
import ResidentProfile from "./components/resident/ResidentProfile";     // NEW
import ResidentOrders from "./components/resident/ResidentOrders";       // NEW
import ResidentSettings from "./components/resident/ResidentSettings";   // NEW
import ServiceDetails from "./components/resident/ServiceDetails";
import OrderTracking from "./components/resident/OrderTracking";

function App() {
  const [view, setView] = useState("landing");
  const [providerView, setProviderView] = useState("dashboard");
  const [residentView, setResidentView] = useState("home");
  const [orderDetails, setOrderDetails] = useState(null);

  const handleLogin = (role) => {
    if (role === "provider") {
      setProviderView("dashboard");
      setView("provider");
    } else if (role === "admin") {
      setView("admin");
    } else {
      // default → resident
      setResidentView("home");
      setView("resident");
    }
  };

  const handleRegisterSuccess = () => setView("login");

  const handleTrackOrder = (details) => {
    setOrderDetails(details);
    setView("orderTracking");
  };

  const renderView = () => {
    switch (view) {

      // ── Public ───────────────────────────────────────────────
      case "landing":
        return (
          <Landing
            goLogin={() => setView("login")}
            goService={() => { setResidentView("home"); setView("resident"); }}
          />
        );

      case "login":
        return (
          <LoginPage
            onLogin={handleLogin}
            onBack={() => setView("landing")}
            onRegister={() => setView("register")}
          />
        );

      case "register":
        return (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onBack={() => setView("login")}
          />
        );

      // ── Resident Module ───────────────────────────────────────
      case "resident":
        switch (residentView) {
          case "profile":
            return (
              <ResidentProfile
                onBack={() => setResidentView("home")}
                onNavigate={(v) => setResidentView(v)}
              />
            );

          case "orders":
            return (
              <ResidentOrders
                onBack={() => setResidentView("home")}
                onNavigate={(v) => setResidentView(v)}
              />
            );

          case "settings":
            return (
              <ResidentSettings
                onBack={() => setResidentView("home")}
              />
            );

          case "serviceDetails":
            return (
              <ServiceDetails
                onTrackOrder={handleTrackOrder}
                onBack={() => setResidentView("home")}
              />
            );

          case "home":
          default:
            return (
              <ResidentHome
                onNavigate={(v) => {
                  // map view names to residentView keys
                  setResidentView(v);
                }}
                onBack={() => setView("login")}
              />
            );
        }

      // ── Provider Module ───────────────────────────────────────
      case "provider":
        switch (providerView) {
          case "profile":
            return <ProviderProfile onBack={() => setProviderView("dashboard")} />;

          case "settings":
            return <ProviderSettings onBack={() => setProviderView("dashboard")} />;

          case "reviews":
            return <ProviderReviews onBack={() => setProviderView("dashboard")} />;

          case "earnings":
            return <ProviderEarnings onBack={() => setProviderView("dashboard")} />;

          case "orders":                                                // NEW
            return <ProviderOrders onBack={() => setProviderView("dashboard")} />;

          case "dashboard":
          default:
            return (
              <ProviderDashboard
                onNavigate={setProviderView}
                onBack={() => setView("login")}
              />
            );
        }

      // ── Admin ─────────────────────────────────────────────────
      case "admin":
        return <AdminDashboard onBack={() => setView("login")} />;

      // ── Legacy / standalone ───────────────────────────────────
      case "serviceDetails":
        return (
          <ServiceDetails
            onTrackOrder={handleTrackOrder}
            onBack={() => setView("landing")}
          />
        );

      case "orderTracking":
        return (
          <OrderTracking
            orderDetails={orderDetails}
            onBack={() => setView("serviceDetails")}
          />
        );

      default:
        return (
          <Landing
            goLogin={() => setView("login")}
            goService={() => { setResidentView("home"); setView("resident"); }}
          />
        );
    }
  };

  return <div className="app-shell">{renderView()}</div>;
}

export default App;
