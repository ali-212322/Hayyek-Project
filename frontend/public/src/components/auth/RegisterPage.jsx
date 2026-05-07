import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import C from "../../styles/colors";

function RegisterPage({ onRegisterSuccess, onBack }) {
  const [step, setStep] = useState(1); // 1: details, 2: verification
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("resident"); // resident or provider
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register, sendOTP, verifyOTP, loading, error } = useAuth();
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async () => {
    setLocalError("");
    setSuccessMsg("");

    // Validation
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
      // Register user
      await register({
        full_name: fullName,
        email,
        phone,
        password,
        role,
      });

      setSuccessMsg("Registration successful! Please verify your phone number.");
      setStep(2);

      // Send OTP
      await sendOTP(phone);
    } catch (err) {
      setLocalError(err.message || "Registration failed");
    }
  };

  const handleVerifyOTP = async () => {
    setLocalError("");
    if (!otp) {
      setLocalError("Please enter the OTP");
      return;
    }

    try {
      await verifyOTP(phone, otp);
      setSuccessMsg("Phone verified! Redirecting...");
      setTimeout(() => onRegisterSuccess(role), 1500);
    } catch (err) {
      setLocalError(err.message || "OTP verification failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <button className="register-back" onClick={onBack}>← Back</button>

        {step === 1 ? (
          <>
            <div className="register-header">
              <h1>Join Hayyekk</h1>
              <p>Create your account and connect with your neighborhood</p>
            </div>

            {(error || localError) && <div className="err-toast">⚠️ {error || localError}</div>}
            {successMsg && <div className="success-toast">✅ {successMsg}</div>}

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
              <input 
                className="input" 
                type="text" 
                placeholder="Your full name" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-grp">
              <label className="label">Email</label>
              <input 
                className="input" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-grp">
              <label className="label">Phone Number (Saudi)</label>
              <input 
                className="input" 
                type="tel" 
                placeholder="+966 50 123 4567" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-grp">
              <label className="label">Password</label>
              <div className="input-wrap">
                <input 
                  className="input input-padded" 
                  type={showPw ? "text" : "password"} 
                  placeholder="Create a strong password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  className="toggle-pw" 
                  onClick={() => setShowPw(v => !v)}
                  disabled={loading}
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="form-grp">
              <label className="label">Confirm Password</label>
              <input 
                className="input" 
                type="password" 
                placeholder="Confirm your password" 
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                disabled={loading}
              />
            </div>

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

            <button 
              className="btn-primary" 
              onClick={handleRegister}
              disabled={loading || !fullName || !email || !phone || !password}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="register-footer">
              Already have an account? <button onClick={onBack} disabled={loading}>Sign in</button>
            </div>
          </>
        ) : (
          <>
            <div className="verify-header">
              <h1>Verify Your Phone</h1>
              <p>We sent a verification code to {phone}</p>
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
              className="btn-primary" 
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button 
              className="btn-secondary" 
              onClick={() => sendOTP(phone)}
              disabled={loading}
            >
              Resend Code
            </button>

            <button 
              className="btn-text" 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back to Details
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
