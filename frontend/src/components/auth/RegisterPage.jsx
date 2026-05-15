import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("resident");
  const [showPw, setShowPw] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (fullName.trim().length < 2) return "Full name must be at least 2 characters.";
    if (!email.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
    if (!phone.trim()) return "Phone number is required.";
    if (!/^\+?[\d\s\-]{7,}$/.test(phone.trim())) return "Enter a valid phone number (e.g. +966 50 123 4567).";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password) && !/[0-9]/.test(password)) return "Password must contain at least one number or uppercase letter.";
    if (password !== passwordConfirm) return "Passwords do not match.";
    if (!agreeTerms) return "You must agree to the Terms of Service.";
    return null;
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        password_confirm: passwordConfirm,
        role,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-right" style={{ width: "100%", justifyContent: "center" }}>
          <div className="login-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ color: "#2D6A4F" }}>Account Created!</h2>
            <p>Please verify your phone number with the OTP sent to <strong>{phone}</strong>.</p>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "1rem" }}>Redirecting to login…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <div className="login-logo">حيّك<span>.</span></div>
        <div className="login-promo">
          <h2>Join Your Neighborhood Community</h2>
          <p>Connect with trusted local service providers or grow your business within your community.</p>
          <div className="login-features">
            {[
              { icon: "🏘️", text: "Local Community" },
              { icon: "🔒", text: "Safe & Secure" },
              { icon: "⚡", text: "Quick Setup" },
              { icon: "🌟", text: "Verified Providers" },
            ].map((f, i) => (
              <div key={i} className="login-feat" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="login-feat-icon">{f.icon}</div>{f.text}
              </div>
            ))}
          </div>
        </div>
        <div className="login-testimonial">
          <p>"I signed up as a provider and had my first booking within 24 hours. Hayyekk made it incredibly easy."</p>
          <div className="login-t-author">
            <div className="login-t-ava">K</div>
            <div>
              <div className="login-t-name">Khalid Al-Otaibi</div>
              <div className="login-t-role">Service Provider, Riyadh</div>
            </div>
            <div className="login-t-stars">★★★★★</div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <div className="login-eyebrow">Get started for free</div>
            <h1>Join Hayyekk</h1>
            <p>Create your account and connect with your neighborhood</p>
          </div>

          {error && <div className="err-toast">⚠️ {error}</div>}

          {/* Role selector */}
          <div className="register-role-select">
            <button
              type="button"
              className={`role-card ${role === "resident" ? "active" : ""}`}
              onClick={() => setRole("resident")}
            >
              <div className="role-icon">👤</div>
              <div className="role-name">I'm a Resident</div>
              <div className="role-desc">Looking for local services</div>
            </button>
            <button
              type="button"
              className={`role-card ${role === "provider" ? "active" : ""}`}
              onClick={() => setRole("provider")}
            >
              <div className="role-icon">🛠️</div>
              <div className="role-name">I'm a Provider</div>
              <div className="role-desc">Offering services in my area</div>
            </button>
          </div>

          <form onSubmit={handleRegister} noValidate>
            <div className="form-grp">
              <label className="label">Full Name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input
                  className="input input-padded"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-grp">
              <label className="label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  className="input input-padded"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-grp">
              <label className="label">Phone Number</label>
              <div className="input-wrap">
                <span className="input-icon">📱</span>
                <input
                  className="input input-padded"
                  type="tel"
                  placeholder="+966 50 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ paddingRight: "2.6rem" }}
                  autoComplete="new-password"
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPw(v => !v)} disabled={isLoading}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="form-grp">
              <label className="label">Confirm Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="input input-padded"
                  type="password"
                  placeholder="Repeat your password"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="checkbox-wrap">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
              </div>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isLoading || !fullName || !email || !phone || !password || !passwordConfirm || !agreeTerms}
            >
              {isLoading ? "⏳ Creating account…" : "Create my account →"}
            </button>
          </form>

          <div className="login-footer">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "inherit" }}>Sign in</Link>
          </div>
        </div>
        <div className="login-right-foot">© 2026 Hayyekk · <Link to="/" style={{ color: "inherit" }}>Home</Link></div>
      </div>
    </div>
  );
}

export default RegisterPage;
