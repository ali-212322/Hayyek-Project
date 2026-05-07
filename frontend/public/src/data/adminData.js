const ADMIN_STATS = [
  { label:"Total Users", val:"1.2K", trend:"↑ 12% vs last month", cls:"up" },
  { label:"Active Providers", val:"240", trend:"↑ 5% vs last month", cls:"up" },
  { label:"Orders Completed", val:"8.5K", trend:"↑ 18% vs last month", cls:"up" },
  { label:"Revenue (SAR)", val:"120K", trend:"↑ 15% vs last month", cls:"up" },
];

const PROVIDER_REQUESTS = [
  { id:"#PR001", name:"Abdullah S.", service:"Plumbing", date:"2026-05-01", status:"pending" },
  { id:"#PR002", name:"Fatima A.", service:"Cleaning", date:"2026-04-28", status:"pending" },
  { id:"#PR003", name:"Khalid M.", service:"Electrician", date:"2026-04-25", status:"approved" },
];

const COMPLAINTS_DATA = [
  { id:"#C001", orderId:"#1035", customer:"Nour R.", provider:"FixIt Services", date:"2026-05-03", status:"open" },
  { id:"#C002", orderId:"#1022", customer:"Ahmed K.", provider:"Al-Baraka Market", date:"2026-04-29", status:"resolved" },
];

export { ADMIN_STATS, PROVIDER_REQUESTS, COMPLAINTS_DATA };
