const ORDERS_DATA = [
  { id:"#1042", cust:"Ahmad K.", svc:"Home Cleaning", time:"10:30 AM", amt:"SAR 120", status:"pending" },
  { id:"#1041", cust:"Sara M.", svc:"Grocery Delivery", time:"09:15 AM", amt:"SAR 55", status:"accepted" },
  { id:"#1040", cust:"Nour R.", svc:"AC Repair", time:"Yesterday", amt:"SAR 280", status:"completed" },
  { id:"#1039", cust:"Khalid O.", svc:"Laundry", time:"Yesterday", amt:"SAR 75", status:"inprogress" },
];

const SVCS_DATA = [
  { icon:"🧹", name:"Home Cleaning", price:"SAR 120 / session", on:true },
  { icon:"❄️", name:"AC Repair & Service", price:"SAR 250 / visit", on:true },
  { icon:"🔧", name:"General Maintenance", price:"SAR 80 / hour", on:false },
  { icon:"🛒", name:"Grocery Delivery", price:"SAR 15 + items", on:true },
];

export { ORDERS_DATA, SVCS_DATA };
