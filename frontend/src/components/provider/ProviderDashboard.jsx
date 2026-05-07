import React, { useState } from "react";
import C from "../../styles/colors";
import { ORDERS_DATA, SVCS_DATA } from "../../data/providerData";

function ProviderDashboard({ onBack }) {
  const [available, setAvailable] = useState(true);
  const [period, setPeriod] = useState("month");
  const [svcs, setSvcs] = useState(SVCS_DATA);
  const [orders, setOrders] = useState(ORDERS_DATA);

  const updateOrder = (id, status) => setOrders(o => o.map(ord => ord.id===id ? {...ord,status} : ord));
  const toggleSvc = (i) => setSvcs(s => s.map((sv,idx) => idx===i ? {...sv,on:!sv.on} : sv));

  const statusLabel = { pending:"⏳ Pending", accepted:"✅ Accepted", inprogress:"🔄 In Progress", completed:"✔ Completed", rejected:"✗ Rejected" };
  const statusCls = { pending:"badge-pending", accepted:"badge-accepted", inprogress:"badge-progress", completed:"badge-done", rejected:"badge-rejected" };

  const NAV = [
    { icon:"📊", label:"Dashboard", active:true },
    { icon:"📋", label:"Orders", badge:"3" },
    { icon:"🛍️", label:"My Services" },
    { icon:"💰", label:"Earnings" },
    { icon:"⭐", label:"Reviews" },
    { icon:"⚙️", label:"Settings" },
  ];

  return (
    <div className="pd-shell">
      <aside className="sidebar pd-sidebar">
        <div className="sidebar-logo">حيّك<span>.</span></div>
        <div className="sidebar-provider-info">
          <div className="sidebar-ava" style={{ background:C.gf, color:C.gd }}>AH</div>
          <div style={{ fontSize:".84rem", fontWeight:700, color:"#fff" }}>Ahmad Al-Harbi</div>
          <div style={{ fontSize:".7rem", color:"rgba(255,255,255,.45)", marginTop:".1rem" }}>
            <span className="pd-online-dot" />{available ? "Available" : "Busy"}
          </div>
        </div>
        <nav className="pd-nav" style={{ padding:"1.1rem 0", flex:1 }}>
          {NAV.map(n=>(
            <div key={n.label} className={`sidebar-item ${n.active?"active":""}`}>
              <span className="sidebar-icon">{n.icon}</span>{n.label}
              {n.badge && <span className="sidebar-badge">{n.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avail-row">
            <div className={`toggle-switch ${available?"on":"off"}`} onClick={()=>setAvailable(v=>!v)} />
            <span style={{ fontSize:".78rem", color:"rgba(255,255,255,.65)" }}>{available?"I\'m Available":"Set as Busy"}</span>
          </div>
        </div>
      </aside>

      <main className="pd-main">
        <div className="pd-topbar">
          <div className="pd-topbar-title">Provider Dashboard</div>
          <div className="pd-topbar-r">
            <div className="notif-btn">🔔<span className="notif-dot"/></div>
            <div style={{ fontSize:".82rem", color:C.muted, fontWeight:600 }}>Wed, 6 May 2026</div>
          </div>
        </div>

        <div className="pd-content">
          {/* KPIs */}
          <div className="kpi-grid">
            {[
              { icon:"📦", label:"Orders Today", val:"7", change:"↑ +2 vs yesterday", cls:"up" },
              { icon:"💰", label:"Earnings Today", val:"SAR 640", change:"↑ +SAR 120", cls:"up" },
              { icon:"⭐", label:"Avg. Rating", val:"4.8", change:"142 reviews", cls:"up" },
              { icon:"✅", label:"Completion Rate", val:"96%", change:"↓ -1% this week", cls:"dn" },
            ].map(k=>(
              <div key={k.label} className="kpi-card">
                <div className="kpi-icon">{k.icon}</div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-val">{k.val}</div>
                <div className={`kpi-change ${k.cls}`}>{k.change}</div>
              </div>
            ))}
          </div>

          <div className="pd-grid">
            <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
              {/* ORDERS */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Incoming Orders</div></div>
                  <button className="card-action">View all →</button>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Order</th><th>Customer</th><th>Service</th><th>Time</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {orders.map(o=>(
                        <tr key={o.id}>
                          <td><span className="order-id">{o.id}</span></td>
                          <td><div className="cust-row"><div className="mini-ava">{o.cust[0]}</div>{o.cust}</div></td>
                          <td>{o.svc}</td>
                          <td style={{ color:C.muted, fontSize:".8rem" }}>{o.time}</td>
                          <td style={{ fontWeight:700 }}>{o.amt}</td>
                          <td><span className={`badge ${statusCls[o.status]}`}>{statusLabel[o.status]}</span></td>
                          <td>
                            {o.status==="pending" && <div className="action-btns"><button className="btn-accept" onClick={()=>updateOrder(o.id,"accepted")}>Accept</button><button className="btn-reject" onClick={()=>updateOrder(o.id,"rejected")}>Reject</button></div>}
                            {o.status==="accepted" && <button className="btn-accept" onClick={()=>updateOrder(o.id,"inprogress")}>Start</button>}
                            {o.status==="inprogress" && <button className="btn-primary" onClick={()=>updateOrder(o.id,"completed")}>Complete</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MY SERVICES */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">My Services</div></div>
                  <button className="card-action">Add New →</button>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Service</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {svcs.map((s,idx)=>(
                        <tr key={s.name}>
                          <td><div className="cust-row">{s.icon}{s.name}</div></td>
                          <td>{s.price}</td>
                          <td><span className={`badge ${s.on?"badge-approved":"badge-suspend"}`}>{s.on?"Active":"Inactive"}</span></td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-ghost" onClick={()=>toggleSvc(idx)}>{s.on?"Deactivate":"Activate"}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* EARNINGS */}
            <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Earnings Overview</div></div>
                  <div className="card-actions">
                    <button className={`btn-ghost ${period==="week"?"active":""}`} onClick={()=>setPeriod("week")}>Week</button>
                    <button className={`btn-ghost ${period==="month"?"active":""}`} onClick={()=>setPeriod("month")}>Month</button>
                    <button className={`btn-ghost ${period==="year"?"active":""}`} onClick={()=>setPeriod("year")}>Year</button>
                  </div>
                </div>
                <div className="chart-card">[Chart for {period}ly Earnings]</div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Customer Reviews</div></div>
                  <button className="card-action">View all →</button>
                </div>
                <div className="reviews-list" style={{ padding:"1.2rem 1.5rem" }}>
                  <div className="review-card">
                    <div className="review-head">
                      <div className="review-ava" style={{ background:C.gl, color:C.gd }}>SM</div>
                      <div>
                        <div className="review-name">Sara M.</div>
                        <div className="review-date">2 days ago</div>
                      </div>
                    </div>
                    <div className="review-stars">★★★★★</div>
                    <p className="review-text">"Excellent service! Ahmad was prompt and fixed the AC quickly. Highly recommend."</p>
                  </div>
                  <div className="review-card">
                    <div className="review-head">
                      <div className="review-ava" style={{ background:C.gl, color:C.gd }}>NK</div>
                      <div>
                        <div className="review-name">Nasser K.</div>
                        <div className="review-date">1 week ago</div>
                      </div>
                    </div>
                    <div className="review-stars">★★★★☆</div>
                    <p className="review-text">"Good cleaning service, but arrived a bit late. Overall satisfied."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProviderDashboard;
