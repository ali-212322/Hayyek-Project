import "./Landing.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneMock from "./PhoneMock";
import C from "../../styles/colors";

function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* TOP NAV */}
      <nav className={`top-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">حيّك<span>.</span></div>
        <div className="nav-links">
          <button className="nav-link">How it Works</button>
          <button className="nav-link">Testimonials</button>
          <button className="nav-link nav-cta" onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">Connecting Neighborhoods</div>
          <h1 className="hero-headline">
            Your Local Services, <em>Simplified</em>.
          </h1>
          <p className="hero-sub">
            Hayyak connects you with trusted local service providers for all your daily needs. From groceries to home repairs, get it all done with a tap.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/login")}>Get Started Now →</button>
            <button className="btn-ghost">Learn More</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">4.9★</div>
              <div className="stat-lbl">Avg. Rating</div>
            </div>
            <div className="stat-div"></div>
            <div className="stat-item">
              <div className="stat-num">250+</div>
              <div className="stat-lbl">Providers</div>
            </div>
            <div className="stat-div"></div>
            <div className="stat-item">
              <div className="stat-num">10K+</div>
              <div className="stat-lbl">Orders Completed</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <PhoneMock />
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div style={{ maxWidth: "700px", margin: "0 auto 3rem", textAlign: "center" }}>
          <div className="section-eyebrow">Seamless Experience</div>
          <h2 className="section-title">How Hayyak Works in 3 Simple Steps</h2>
        </div>
        <div className="how-grid">
          <div className="how-step">
            <div className="how-step-icon">📍</div>
            <h3 className="how-step-title">Set Your Location</h3>
            <p className="how-step-text">Enter your address or drop a pin on the map to find services near you.</p>
          </div>
          <div className="how-step">
            <div className="how-step-icon">✨</div>
            <h3 className="how-step-title">Browse & Order</h3>
            <p className="how-step-text">Explore categories, compare providers, and place your order in minutes.</p>
          </div>
          <div className="how-step">
            <div className="how-step-icon">✅</div>
            <h3 className="how-step-title">Relax & Enjoy</h3>
            <p className="how-step-text">Track your order in real-time and pay securely after service completion.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div style={{ maxWidth: "700px", margin: "0 auto 3rem", textAlign: "center" }}>
          <div className="section-eyebrow">What Our Users Say</div>
          <h2 className="section-title">Trusted by Thousands in Your Neighborhood</h2>
        </div>
        <div className="t-grid">
          <div className="t-card">
            <div className="t-stars">★★★★★</div>
            <p className="t-text">"Hayyak made my life so much easier! I found a reliable cleaner in minutes. The app is intuitive and the service was excellent."</p>
            <div className="t-author">
              <div className="t-ava" style={{ background: C.gl, color: C.gd }}>SM</div>
              <div>
                <div className="t-name">Sara Al-Mansour</div>
                <div className="t-role">Resident, Al-Yasmin</div>
              </div>
            </div>
          </div>
          <div className="t-card">
            <div className="t-stars">★★★★★</div>
            <p className="t-text">"As a busy professional, I don't have time for errands. Hayyak's grocery delivery is a lifesaver. Always fresh, always on time!"</p>
            <div className="t-author">
              <div className="t-ava" style={{ background: C.gl, color: C.gd }}>KF</div>
              <div>
                <div className="t-name">Khalid Fahad</div>
                <div className="t-role">Resident, Olaya</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOAD CTA */}
      <section className="cta-strip">
        <div className="cta-content">
          <h2 className="cta-title">Download the Hayyak App Today!</h2>
          <p className="cta-text">Experience convenience at your fingertips. Available on both iOS and Android.</p>
          <div className="cta-stores">
            <a href="#" className="store-btn">
              <i className="fa-brands fa-apple store-icon"></i>
              <div>
                <div className="store-text">Download on the</div>
                <div className="store-name">App Store</div>
              </div>
            </a>
            <a href="#" className="store-btn">
              <i className="fa-brands fa-google-play store-icon"></i>
              <div>
                <div className="store-text">Get it on</div>
                <div className="store-name">Google Play</div>
              </div>
            </a>
          </div>
        </div>
        <div className="cta-visual">
          <img src="https://i.imgur.com/2X0Z0Z0.png" alt="Hayyak App Mockup" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">حيّك<span>.</span></div>
        <div className="footer-links">
          <a href="#" className="footer-link">About Us</a>
          <a href="#" className="footer-link">Services</a>
          <a href="#" className="footer-link">Become a Provider</a>
          <a href="#" className="footer-link">Contact</a>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
        <p>© 2026 Hayyak. All rights reserved.</p>
        <div className="footer-social">
          <a href="#" className="social-icon"><i className="fa-brands fa-twitter"></i></a>
          <a href="#" className="social-icon"><i className="fa-brands fa-instagram"></i></a>
          <a href="#" className="social-icon"><i className="fa-brands fa-facebook-f"></i></a>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
