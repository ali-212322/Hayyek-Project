import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";

import Landing from "./components/landing/Landing";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";

import ProviderDashboard from "./components/provider/ProviderDashboard";
import ProviderProfile from "./components/provider/ProviderProfile";
import ProviderSettings from "./components/provider/ProviderSettings";
import ProviderReviews from "./components/provider/ProviderReviews";
import ProviderEarnings from "./components/provider/ProviderEarnings";
import ProviderOrders from "./components/provider/ProviderOrders";

import AdminDashboard from "./components/admin/AdminDashboard";

import ResidentHome from "./components/resident/ResidentHome";
import ResidentProfile from "./components/resident/ResidentProfile";
import ResidentOrders from "./components/resident/ResidentOrders";
import ResidentSettings from "./components/resident/ResidentSettings";
import PaymentPage from "./components/resident/PaymentPage";
import PaymentCallback from "./components/resident/PaymentCallback";

function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#2D6A4F" }}>
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    const home = user?.role === "provider" ? "/provider" : user?.role === "admin" ? "/admin" : "/resident";
    return <Navigate to={home} replace />;
  }

  return children;
}

function AuthRedirect() {
  const { isAuthenticated, user, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    if (user.role === "provider") return <Navigate to="/provider" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/resident" replace />;
  }

  return null;
}

function App() {
  return (
    <div className="app-shell">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Resident */}
        <Route path="/resident" element={<ProtectedRoute allowedRole="resident"><ResidentHome /></ProtectedRoute>} />
        <Route path="/resident/profile" element={<ProtectedRoute allowedRole="resident"><ResidentProfile /></ProtectedRoute>} />
        <Route path="/resident/orders" element={<ProtectedRoute allowedRole="resident"><ResidentOrders /></ProtectedRoute>} />
        <Route path="/resident/payment" element={<ProtectedRoute allowedRole="resident"><PaymentPage /></ProtectedRoute>} />
        <Route path="/resident/settings" element={<ProtectedRoute allowedRole="resident"><ResidentSettings /></ProtectedRoute>} />

        {/* Provider */}
        <Route path="/provider" element={<ProtectedRoute allowedRole="provider"><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/provider/orders" element={<ProtectedRoute allowedRole="provider"><ProviderOrders /></ProtectedRoute>} />
        <Route path="/provider/profile" element={<ProtectedRoute allowedRole="provider"><ProviderProfile /></ProtectedRoute>} />
        <Route path="/provider/earnings" element={<ProtectedRoute allowedRole="provider"><ProviderEarnings /></ProtectedRoute>} />
        <Route path="/provider/reviews" element={<ProtectedRoute allowedRole="provider"><ProviderReviews /></ProtectedRoute>} />
        <Route path="/provider/settings" element={<ProtectedRoute allowedRole="provider"><ProviderSettings /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<AuthRedirect />} />
        <Route path="/resident/payment/callback" element={<ProtectedRoute allowedRole="resident"><PaymentCallback /></ProtectedRoute>} />
        <Route path="/resident/payment/callback" element={<ProtectedRoute allowedRole="resident"><PaymentCallback /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
