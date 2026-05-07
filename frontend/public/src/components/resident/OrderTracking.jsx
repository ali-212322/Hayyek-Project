import React from "react";
import C from "../../styles/colors";

function OrderTracking({ orderDetails, onBack }) {
  const statusSteps = [
    { label: "Order Placed", time: "10:00 AM", desc: "Waiting for provider confirmation" },
    { label: "Accepted by Provider", time: "10:15 AM", desc: "Provider is preparing for service" },
    { label: "In Progress", time: "11:00 AM", desc: "Provider is on the way or performing service" },
    { label: "Completed", time: "12:30 PM", desc: "Service has been successfully completed" },
  ];

  const currentStatusIndex = 2; // Example: In Progress

  return (
    <div className="track-root">
      <button className="track-back" onClick={onBack}>← Back to Services</button>

      <div className="track-hero">
        <div className="track-order-id">Order #{Math.floor(Math.random() * 10000)}</div>
        <h1 className="track-title">Your Service is In Progress</h1>
        <div className="track-meta">
          <div className="track-meta-item">🗓️ {orderDetails.date}</div>
          <div className="track-meta-item">⏰ {orderDetails.time}</div>
          <div className="track-meta-item">🛠️ {orderDetails.service}</div>
        </div>
      </div>

      <div className="track-status-card">
        <div className="track-status-title">Order Status <span className="live-badge">Live</span></div>
        <div className="track-steps">
          {statusSteps.map((step, index) => (
            <div key={index} className="track-step">
              <div className="track-step-left">
                <div className={`track-step-circle ${index < currentStatusIndex ? "done" : index === currentStatusIndex ? "active" : "idle"}`}>
                  {index < currentStatusIndex ? "✔" : index === currentStatusIndex ? "●" : index + 1}
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`track-step-line ${index < currentStatusIndex ? "done" : "idle"}`}></div>
                )}
              </div>
              <div className="track-step-content">
                <div className={`track-step-label ${index < currentStatusIndex ? "done" : index === currentStatusIndex ? "active" : "idle"}`}>
                  {step.label}
                </div>
                <div className="track-step-time">{step.time}</div>
                <div className="track-step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="track-provider-card">
        <div className="track-prov-info">
          <div className="track-prov-ava" style={{ background: C.gl, color: C.gd }}>
            {orderDetails.provider.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="track-prov-name">{orderDetails.provider}</div>
            <div className="track-prov-role">Your Service Provider</div>
            <div className="track-prov-rating">4.9 ★</div>
          </div>
        </div>
        <div className="track-prov-btns">
          <button className="track-btn-call">📞 Call</button>
          <button className="track-btn-msg">💬 Message</button>
        </div>
      </div>

      <div className="track-order-summary">
        <div className="track-sum-title">Order Summary</div>
        <div className="track-sum-row"><span className="track-sum-lbl">Service:</span><span>{orderDetails.service}</span></div>
        <div className="track-sum-row"><span className="track-sum-lbl">Date:</span><span>{orderDetails.date}</span></div>
        <div className="track-sum-row"><span className="track-sum-lbl">Time:</span><span>{orderDetails.time}</span></div>
        <div className="track-sum-row"><span className="track-sum-lbl">Total:</span><span>SAR 130</span></div>
      </div>
    </div>
  );
}

export default OrderTracking;
