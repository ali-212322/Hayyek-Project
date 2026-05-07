import React, { useState } from "react";
import C from "../../styles/colors";
import ALL_PROVIDERS from "../../data/providers";

function ServiceDetails({ onTrackOrder, onBack }) {
  const provider = ALL_PROVIDERS.grocery[0]; // Example: using the first grocery provider
  const [selectedService, setSelectedService] = useState(provider.services[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleOrder = () => {
    if (selectedService && date && time) {
      onTrackOrder({ provider: provider.name, service: selectedService.name, date, time });
    } else {
      alert("Please select a service, date, and time.");
    }
  };

  return (
    <div className="sd-layout">
      <div className="sd-main">
        <button className="sd-back" onClick={onBack}>← Back to Home</button>

        <div className="sd-provider-header">
          <div className="sd-prov-ava" style={{ background: provider.bg, color: provider.fg }}>
            {provider.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="sd-prov-name">{provider.name}</div>
            <div className="sd-prov-meta">
              <span>{provider.distance}</span>
              <span style={{ fontSize: "8px", color: C.light }}>●</span>
              <span className="sd-prov-rating">{provider.rating} ★ ({provider.reviews})</span>
            </div>
          </div>
        </div>

        <p className="sd-prov-about">{provider.about}</p>

        <div className="sd-stats">
          {provider.stats.map((s, i) => (
            <div key={i} className="sd-stat-item">
              <div className="sd-stat-val">{s[0]}</div>
              <div className="sd-stat-lbl">{s[1]}</div>
            </div>
          ))}
        </div>

        <div className="sd-section-title">Available Services</div>
        <div className="svcs-grid">
          {provider.services.map((svc, i) => (
            <div
              key={i}
              className={`svc-opt ${selectedService && selectedService.name === svc.name ? "sel" : ""}`}
              onClick={() => setSelectedService(svc)}
            >
              <div className="svc-opt-icon">{svc.icon}</div>
              <div className="svc-opt-name">{svc.name}</div>
              <div className="svc-opt-desc">{svc.desc}</div>
              <div className="svc-opt-price">SAR {svc.price}</div>
              <div className="svc-opt-dur">{svc.dur}</div>
              {selectedService && selectedService.name === svc.name && (
                <div className="svc-check">✔</div>
              )}
            </div>
          ))}
        </div>

        <div className="sd-section-title" style={{ marginTop: "2rem" }}>Customer Reviews</div>
        <div className="reviews-list">
          <div className="review-card">
            <div className="review-head">
              <div className="review-ava" style={{ background: C.gl, color: C.gd }}>AH</div>
              <div>
                <div className="review-name">Ahmed H.</div>
                <div className="review-date">3 days ago</div>
              </div>
            </div>
            <div className="review-stars">★★★★★</div>
            <p className="review-text">"Always fresh produce and quick delivery. Highly recommended!"</p>
          </div>
          <div className="review-card">
            <div className="review-head">
              <div className="review-ava" style={{ background: C.gl, color: C.gd }}>LM</div>
              <div>
                <div className="review-name">Laila M.</div>
                <div className="review-date">1 week ago</div>
              </div>
            </div>
            <div className="review-stars">★★★★☆</div>
            <p className="review-text">"Good selection, but sometimes items are out of stock. Overall good service."</p>
          </div>
        </div>
      </div>

      <div className="sd-sidebar">
        <div className="order-card">
          <div className="order-card-header">
            <div className="order-card-title">Your Order</div>
            <div className="order-card-sub">Confirm your service details</div>
          </div>
          <div className="order-card-body">
            <div className="form-grp">
              <label className="label">Selected Service</label>
              <input className="input" value={selectedService ? selectedService.name : ""} readOnly />
            </div>
            <div className="date-grid">
              <div className="form-grp">
                <label className="label">Date</label>
                <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-grp">
                <label className="label">Time</label>
                <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>
            <div className="summary-box">
              <div className="sum-row"><span className="sum-lbl">Service Fee</span><span>SAR {selectedService ? selectedService.price : "0"}</span></div>
              <div className="sum-row"><span className="sum-lbl">Delivery Fee</span><span>SAR 10</span></div>
              <div className="sum-row"><span className="sum-lbl">Total</span><span>SAR {selectedService ? selectedService.price + 10 : "10"}</span></div>
            </div>
            <button className="btn-order" onClick={handleOrder} disabled={!selectedService || !date || !time}>
              Book Now →
            </button>
            <p className="order-terms">
              By booking, you agree to Hayyak's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;
