import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import C from "../../styles/colors";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  // Already logged in → redirect
  if (isAuthenticated && user) {
    const home = user.role === "provider" ? "/provider" : user.role === "admin" ? "/admin" : "/resident";
    return <Navigate to={home} replace />;
  }

  const validate = () => {
    if (!phone.trim()) return "Phone number is required.";
    if (!/^\+?[\d\s\-]{7,}$/.test(phone.trim())) return "Enter a valid phone number (e.g. +966 50 123 4567).";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    try {
      const response = await login({ phone: phone.trim(), password });
      const role = response?.user?.role || "resident";
      if (role === "provider") navigate("/provider", { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
      else navigate("/resident", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin(e);
  };

  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <div className="login-logo">حيّك<span>.</span></div>
        <div className="login-promo">
          <h2>Connect with Your Neighborhood</h2>
          <p>Find trusted local services and grow your business within your community.</p>
          <div className="login-features">
            {[
              { icon: "🤝", text: "Trusted Providers" },
              { icon: "⚡", text: "Instant Booking" },
              { icon: "📍", text: "Local & Fast" },
              { icon: "🌟", text: "Quality Guaranteed" },
            ].map((f, i) => (
              <div key={i} className="login-feat" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="login-feat-icon">{f.icon}</div>{f.text}
              </div>
            ))}
          </div>
        </div>
        <div className="login-testimonial">
          <p>"Moved last month and felt completely lost. Hayyekk showed me everything I needed in my first hour."</p>
          <div className="login-t-author">
            <div className="login-t-ava">N</div>
            <div>
              <div className="login-t-name">Nour Al-Rashidi</div>
              <div className="login-t-role">New resident, Al-Zaytoun</div>
            </div>
            <div className="login-t-stars">★★★★★</div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <div className="login-eyebrow">Welcome back</div>
            <h1>Sign in to Hayyekk</h1>
            <p>Access your neighborhood services</p>
          </div>

          {error && <div className="err-toast">⚠️ {error}</div>}

          <div className="divider"><span>sign in with phone &amp; password</span></div>

          <form onSubmit={handleLogin} noValidate>
            <div className="form-grp">
              <label className="label">Phone number</label>
              <div className="input-wrap">
                <span className="input-icon">📱</span>
                <input
                  className="input input-padded"
                  type="tel"
                  placeholder="+966 50 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="form-grp">
              <label className="label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="input input-padded"
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  style={{ paddingRight: "2.6rem" }}
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(v => !v)} disabled={isLoading}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="checkbox-wrap">
                <input type="checkbox" id="rem" checked={remember} onChange={e => setRemember(e.target.checked)} disabled={isLoading} />
                <label htmlFor="rem">Remember me</label>
              </div>
              <button type="button" className="forgot-btn" disabled={isLoading}>Forgot password?</button>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isLoading || !phone || !password}
            >
              {isLoading ? "⏳ Signing in…" : "Sign in to my neighborhood →"}
            </button>
          </form>

          <div className="login-footer">
            New to Hayyekk?{" "}
            <Link to="/register" style={{ color: "inherit" }}>Join your neighborhood</Link>
          </div>
        </div>
        <div className="login-right-foot">
          © 2026 Hayyekk ·{" "}
          <Link to="/" style={{ color: "inherit" }}>Home</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
