import React from "react";

function ProviderSettings() {
  return (
    <div className="card">
      <h2>Settings</h2>

      <input
        className="input"
        placeholder="Phone"
      />

      <br /><br />

      <input
        className="input"
        placeholder="Address"
      />

      <br /><br />

      <button className="btn-primary">
        Save
      </button>
    </div>
  );
}

export default ProviderSettings;
