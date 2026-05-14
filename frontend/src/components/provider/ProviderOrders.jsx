/* frontend/src/components/provider/ProviderOrders.css */
:root { --green:#2D6A4F; --green-pale:#d8f3dc; }
* { box-sizing:border-box; margin:0; padding:0; }

.po-root { min-height:100vh; background:#f8faf8; font-family:'Plus Jakarta Sans','Segoe UI',sans-serif; }

.po-header { background:var(--green); padding:16px 24px; display:flex; align-items:center; justify-content:space-between; color:#fff; }
.po-back { background:none; border:none; color:#fff; font-size:0.9rem; cursor:pointer; }
.po-title { font-size:1.1rem; font-weight:700; }

.po-container { max-width:640px; margin:0 auto; padding:24px 20px 60px; }

.po-filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px; }
.po-filter-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; border-radius:50px; border:2px solid var(--green-pale); background:#fff; color:var(--green); font-size:0.82rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
.po-filter-btn.active { background:var(--green); color:#fff; border-color:var(--green); }
.po-count { background:rgba(255,255,255,0.25); border-radius:20px; padding:1px 7px; font-size:0.72rem; }
.po-filter-btn:not(.active) .po-count { background:var(--green-pale); color:var(--green); }

.po-empty { text-align:center; padding:60px 20px; color:#6b7280; }
.po-empty p:first-child { font-size:3rem; margin-bottom:12px; }

.po-list { display:flex; flex-direction:column; gap:16px; }

.po-card { background:#fff; border-radius:16px; padding:20px; box-shadow:0 4px 16px rgba(45,106,79,0.09); border:1px solid #e8f4ed; }
.po-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.po-card-top h3 { font-size:1rem; font-weight:700; color:#1a2e1a; }
.po-category { font-size:0.78rem; color:#6b7280; margin-top:3px; }
.po-status { font-size:0.75rem; font-weight:700; padding:4px 12px; border-radius:20px; white-space:nowrap; }

.po-rows { display:flex; flex-direction:column; gap:10px; }
.po-row { display:flex; justify-content:space-between; gap:12px; font-size:0.85rem; }
.po-row span:first-child { color:#6b7280; white-space:nowrap; }
.po-row span:last-child { color:#1a2e1a; font-weight:500; text-align:right; }

.po-actions { display:flex; gap:10px; margin-top:16px; }
.po-action-btn { flex:1; padding:10px; border:none; border-radius:10px; font-size:0.88rem; font-weight:700; cursor:pointer; transition:opacity 0.2s; }
.po-action-btn:hover { opacity:0.85; }
.po-accept { background:var(--green); color:#fff; }
.po-cancel { background:#fee2e2; color:#b91c1c; }

.po-card-id { margin-top:14px; padding-top:12px; border-top:1px solid #f3f4f6; font-size:0.72rem; color:#9ca3af; }
