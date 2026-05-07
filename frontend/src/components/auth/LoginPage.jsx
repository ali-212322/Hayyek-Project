import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import C from "../../styles/colors";

function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login, loading, error } = useAuth();
  const [localError, setLocalError] = useState("");

  const handleLogin = async () => {
    setLocalError("");
    try {
      const response = await login({ email, password });
      const userType = response.data?.user?.role || response.user?.role || "resident";
      onLogin(userType);
    } catch (err) {
      setLocalError(err.message || "Login failed. Please try again.");
    }
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
            {[{"icon":"🤝","text":"Trusted Providers"},{"icon":"⚡","text":"Instant Booking"},{"icon":"📍","text":"Local & Fast"},{"icon":"🌟","text":"Quality Guaranteed"}].map((f,i)=>(
              <div key={i} className="login-feat" style={{ animationDelay:`${i*.1}s` }}>
                <div className="login-feat-icon">{f.icon}</div>{f.text}
              </div>
            ))}
          </div>
        </div>
        <div className="login-testimonial">
          <p>"Moved last month and felt completely lost. Hayyekk showed me everything I needed in my first hour."</p>
          <div className="login-t-author">
            <div className="login-t-ava">N</div>
            <div><div className="login-t-name">Nour Al-Rashidi</div><div className="login-t-role">New resident, Al-Zaytoun</div></div>
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
          {(error || localError) && <div className="err-toast">⚠️ {error || localError}</div>}
          <button className="social-btn">🌐 Continue with Google</button>
          <button className="social-btn">📱 Continue with Phone</button>
          <div className="divider"><span>or sign in with email</span></div>

          <div className="form-grp">
            <label className="label">Email address</label>
            <div className="input-wrap">
              <span className="input-icon">✉️</span>
              <input 
                className="input input-padded" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={e=>setEmail(e.target.value)}
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
                type={showPw?"text":"password"} 
                placeholder="Your password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                disabled={loading}
                style={{ paddingRight:"2.6rem" }} 
              />
              <button 
                className="toggle-pw" 
                onClick={()=>setShowPw(v=>!v)}
                disabled={loading}
              >
                {showPw?"🙈":"👁"}
              </button>
            </div>
          </div>
          <div className="form-row">
            <div className="checkbox-wrap">
              <input 
                type="checkbox" 
                id="rem" 
                checked={remember} 
                onChange={e=>setRemember(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="rem">Remember me</label>
            </div>
            <button className="forgot-btn" disabled={loading}>Forgot password?</button>
          </div>
          <button 
            className="btn-login" 
            onClick={handleLogin} 
            disabled={loading || !email || !password}
          >
            {loading ? <>⏳ Signing in…</> : "Sign in to my neighborhood →"}
          </button>
          <div className="login-footer">
            New to Hayyekk? <button onClick={onBack} disabled={loading}>Join your neighborhood</button>
          </div>
        </div>
        <div className="login-right-foot">© 2026 Hayyekk · <a href="#" style={{ color:"inherit" }}>Privacy</a></div>
      </div>
    </div>
  );
}

export default LoginPage;
