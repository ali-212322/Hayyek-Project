import React from "react";
import C from "../../styles/colors";

const PhoneMock = () => (
  <div className="phone-frame">
    <div className="phone-screen">
      <div className="phone-status">
        <span>9:41</span>
        <span>
          <i className="fa-solid fa-signal"></i> <i className="fa-solid fa-wifi"></i> 100%
        </span>
      </div>
      <div className="phone-header">
        <div className="phone-greeting">Good morning, Ahmed!</div>
        <div className="phone-loc">
          <i className="fa-solid fa-location-dot"></i> Al-Zaytoun, Riyadh
        </div>
        <div className="phone-search">
          <i className="fa-solid fa-search"></i> Search for services...
        </div>
      </div>
      <div className="phone-cats">
        <div className="phone-cat">
          <div className="phone-cat-icon">🛒</div>
          <div className="phone-cat-lbl">Grocery</div>
        </div>
        <div className="phone-cat">
          <div className="phone-cat-icon">🧺</div>
          <div className="phone-cat-lbl">Laundry</div>
        </div>
        <div className="phone-cat">
          <div className="phone-cat-icon">🔧</div>
          <div className="phone-cat-lbl">Repair</div>
        </div>
        <div className="phone-cat">
          <div className="phone-cat-icon">🍽️</div>
          <div className="phone-cat-lbl">Food</div>
        </div>
      </div>
      <div className="phone-sec-title">Popular Providers</div>
      <div className="phone-row">
        <div className="phone-row-icon" style={{ background: C.gl, color: C.gd }}>
          AB
        </div>
        <div>
          <div className="phone-row-name">Al-Baraka Market</div>
          <div className="phone-row-meta">Grocery · 4.9 ★</div>
        </div>
        <div className="phone-row-badge open">Open</div>
      </div>
      <div className="phone-row">
        <div className="phone-row-icon" style={{ background: C.gl, color: C.gd }}>
          SC
        </div>
        <div>
          <div className="phone-row-name">Sparkle Clean</div>
          <div className="phone-row-meta">Laundry · 4.8 ★</div>
        </div>
        <div className="phone-row-badge open">Open</div>
      </div>
    </div>
  </div>
);

export default PhoneMock;
