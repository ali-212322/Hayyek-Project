import React, { useState } from "react";
import "./styles/global.css";

import Landing from "./components/landing/Landing";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

import ProviderDashboard from "./components/provider/ProviderDashboard";
import ProviderProfile from "./components/provider/ProviderProfile";
import ProviderSettings from "./components/provider/ProviderSettings";
import ProviderReviews from "./components/provider/ProviderReviews";
import ProviderEarnings from "./components/provider/ProviderEarnings";

import AdminDashboard from "./components/admin/AdminDashboard";
import ServiceDetails from "./components/resident/ServiceDetails";
import OrderTracking from "./components/resident/OrderTracking";

function App() {
  const [view, setView] = useState("landing");
  const [userType, setUserType] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // 👉 NEW: provider sub-navigation
  const [providerView, setProviderView] = useState("dashboard");

  const handleLogin = (type) => {
    setUserType(type);

    if (type === "provider") {
      setView("provider");
      setProviderView("dashboard");
    } else if (type === "admin") {
      setView("admin");
    } else {
      setView("serviceDetails");
    }
  };

  const handleRegisterSuccess = (type) => {
    handleLogin(type);
  };

  const handleTrackOrder = (details) => {
    setOrderDetails(details);
    setView("orderTracking");
  };

  const renderView = () => {
    switch (view) {
      case "landing":
        return (
          <Landing
            goLogin={() => setView("login")}
            goService={() => setView("serviceDetails")}
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

      // 👇 PROVIDER MODULE (NOW WITH SUB-PAGES)
      case "provider":
        switch (providerView) {
          case "profile":
            return (
              <ProviderProfile onBack={() => setProviderView("dashboard")} />
            );

          case "settings":
            return (
              <ProviderSettings onBack={() => setProviderView("dashboard")} />
            );

          case "reviews":
            return (
              <ProviderReviews onBack={() => setProviderView("dashboard")} />
            );

          case "earnings":
            return (
              <ProviderEarnings onBack={() => setProviderView("dashboard")} />
            );

          case "dashboard":
          default:
            return (
              <ProviderDashboard
                onNavigate={setProviderView}
                onBack={() => setView("login")}
              />
            );
        }

      case "admin":
        return <AdminDashboard onBack={() => setView("login")} />;

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
            goService={() => setView("serviceDetails")}
          />
        );
    }
  };

  return <div className="app-shell">{renderView()}</div>;
}

export default App;
