import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";

function RegisterPage({ onRegisterSuccess, onBack }) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("resident");
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register, sendOTP, verifyOTP, loading, error } = useAuth();
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async () => {
    setLocalError("");
    setSuccessMsg("");
    if (!fullName || !email || !phone || !password) {
      setLocalError("Please fill in all fields");
      return;
    }
    if (password !== passwordConfirm) {
      setLocalError("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      setLocalError("Please agree to the terms and conditions");
      return;
    }
    try {
      await register({ full_name: fullName, email, phone, password, password_confirm: passwordConfirm, role });
      setSuccessMsg("Registration successful! Please verify your phone number.");
      setStep(2);
    } catch (err) {
      setLocalError(err.message || "Registration failed");
    }
  };

  const handleVerifyOTP = async () => {
    setLocalError("");
    if (!otp) { setLocalError("Please enter the OTP"); return; }
    try {
      await verifyOTP(phone, otp);
      setSuccessMsg("Phone verified! Redirecting...");
      setTimeout(() => onRegisterSuccess(role), 1500);
    } catch (err) {
      setLocalError(err.message || "OTP verification failed");
    }
  };

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
          {step === 1 ? (
            <>
              <div className="login-header">
                <div className="login-eyebrow">Get started for free</div>
                <h1>Join Hayyekk</h1>
                <p>Create your account and connect with your neighborhood</p>
              </div>

              {(error || localError) && <div className="err-toast">⚠️ {error || localError}</div>}
              {successMsg && <div className="success-toast">✅ {successMsg}</div>}

              {/* Role selector */}
              <div className="register-role-select">
                <button
                  className={`role-card ${role === "resident" ? "active" : ""}`}
                  onClick={() => setRole("resident")}
                >
                  <div className="role-icon">👤</div>
                  <div className="role-name">I'm a Resident</div>
                  <div className="role-desc">Looking for local services</div>
                </button>
                <button
                  className={`role-card ${role === "provider" ? "active" : ""}`}
                  onClick={() => setRole("provider")}
                >
                  <div className="role-icon">🛠️</div>
                  <div className="role-name">I'm a Provider</div>
                  <div className="role-desc">Offering services in my area</div>
                </button>
              </div>

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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    style={{ paddingRight: "2.6rem" }}
                  />
                  <button className="toggle-pw" onClick={() => setShowPw(v => !v)} disabled={loading}>
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
                </div>
              </div>

              <button
                className="btn-login"
                onClick={handleRegister}
                disabled={loading || !fullName || !email || !phone || !password || !agreeTerms}
              >
                {loading ? <>⏳ Creating account…</> : "Create my account →"}
              </button>

              <div className="login-footer">
                Already have an account?{" "}
                <button onClick={onBack} disabled={loading}>Sign in</button>
              </div>
            </>
          ) : (
            <>
              <div className="login-header">
                <div className="login-eyebrow">One last step</div>
                <h1>Verify Your Phone</h1>
                <p>We sent a 6-digit code to <strong>{phone}</strong></p>
              </div>

              {(error || localError) && <div className="err-toast">⚠️ {error || localError}</div>}
              {successMsg && <div className="success-toast">✅ {successMsg}</div>}

              <div className="form-grp">
                <label className="label">Verification Code</label>
                <input
                  className="input otp-input"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  maxLength="6"
                />
              </div>

              <button
                className="btn-login"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? <>⏳ Verifying…</> : "Verify & Continue →"}
              </button>

              <button className="btn-secondary" onClick={() => sendOTP(phone).catch(e => setLocalError(e.message || "Could not resend code."))} disabled={loading}>
                Resend Code
              </button>

              <button className="btn-text" onClick={() => setStep(1)} disabled={loading}>
                ← Back to Details
              </button>
            </>
          )}
        </div>
        <div className="login-right-foot">© 2026 Hayyekk · <a href="#" style={{ color: "inherit" }}>Privacy</a></div>
      </div>
    </div>
  );
}

export default RegisterPage;
