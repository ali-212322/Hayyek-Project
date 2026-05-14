import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🧑‍🔧 Provider Dashboard */}
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />
        <Route path="/provider/settings" element={<ProviderSettings />} />
        <Route path="/provider/reviews" element={<ProviderReviews />} />
        <Route path="/provider/earnings" element={<ProviderEarnings />} />

        {/* 🛠 Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 🏠 Resident flow */}
        <Route path="/service" element={<ServiceDetails />} />
        <Route path="/track" element={<OrderTracking />} />

        {/* 🔁 fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;  const handleTrackOrder = (details) => {
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
