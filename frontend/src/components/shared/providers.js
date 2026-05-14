// frontend/src/components/shared/providers.js
// Mock data — replace with real API calls later

export const CATEGORIES = ["Cleaning", "AC Repair & Service", "General Maintenance"];

export const PROVIDERS = [
  // ── Cleaning ──────────────────────────────────────────────
  {
    id: "prov-001",
    shopName: "SparkleClean",
    ownerName: "Ahmad Al-Rashidi",
    avatar: "🧹",
    category: "Cleaning",
    rating: 4.8,
    reviewCount: 124,
    priceRange: "SAR 80 – 250",
    basePrice: 80,
    description: "Deep home cleaning, move-in/move-out, post-construction dust removal.",
    available: true,
    location: "Riyadh – Al Malaz",
    tags: ["Deep Clean", "Move-in/out", "Post-construction"],
  },
  {
    id: "prov-002",
    shopName: "NeatNest",
    ownerName: "Fatima Al-Qahtani",
    avatar: "✨",
    category: "Cleaning",
    rating: 4.6,
    reviewCount: 89,
    priceRange: "SAR 60 – 180",
    basePrice: 60,
    description: "Regular housekeeping, laundry, kitchen & bathroom deep clean.",
    available: true,
    location: "Riyadh – Al Nakheel",
    tags: ["Regular", "Kitchen", "Laundry"],
  },

  // ── AC Repair & Service ────────────────────────────────────
  {
    id: "prov-003",
    shopName: "CoolTech AC",
    ownerName: "Khalid Al-Otaibi",
    avatar: "❄️",
    category: "AC Repair & Service",
    rating: 4.9,
    reviewCount: 201,
    priceRange: "SAR 120 – 600",
    basePrice: 120,
    description: "AC installation, gas recharge, PCB repair, annual maintenance contracts.",
    available: true,
    location: "Riyadh – Al Olaya",
    tags: ["Installation", "Gas Recharge", "PCB Repair"],
  },
  {
    id: "prov-004",
    shopName: "ArcticFix",
    ownerName: "Saud Al-Harbi",
    avatar: "🌬️",
    category: "AC Repair & Service",
    rating: 4.5,
    reviewCount: 67,
    priceRange: "SAR 100 – 450",
    basePrice: 100,
    description: "Split unit servicing, duct cleaning, thermostat calibration.",
    available: false,
    location: "Riyadh – Al Rawdah",
    tags: ["Split Unit", "Duct Cleaning", "Thermostat"],
  },

  // ── General Maintenance ────────────────────────────────────
  {
    id: "prov-005",
    shopName: "FixIt Fast",
    ownerName: "Omar Al-Zahrani",
    avatar: "🔧",
    category: "General Maintenance",
    rating: 4.7,
    reviewCount: 158,
    priceRange: "SAR 50 – 400",
    basePrice: 50,
    description: "Plumbing, electrical fixes, tile repair, painting, furniture assembly.",
    available: true,
    location: "Riyadh – Al Salam",
    tags: ["Plumbing", "Electrical", "Painting"],
  },
  {
    id: "prov-006",
    shopName: "HomeGuard Pro",
    ownerName: "Rakan Al-Dossari",
    avatar: "🏠",
    category: "General Maintenance",
    rating: 4.4,
    reviewCount: 43,
    priceRange: "SAR 70 – 350",
    basePrice: 70,
    description: "Comprehensive home maintenance packages, handyman on demand.",
    available: true,
    location: "Riyadh – Al Yasmin",
    tags: ["Packages", "Handyman", "On-demand"],
  },
];

// Simulated orders store (in-memory, replace with API)
let _orders = [
  {
    id: "ord-001",
    residentId: "user-1",
    providerId: "prov-003",
    providerName: "CoolTech AC",
    category: "AC Repair & Service",
    service: "Gas Recharge",
    status: "in_progress",
    date: "2025-05-12",
    price: 180,
    address: "Villa 14, Al Olaya, Riyadh",
    notes: "Second floor unit, access via back gate.",
  },
  {
    id: "ord-002",
    residentId: "user-1",
    providerId: "prov-001",
    providerName: "SparkleClean",
    category: "Cleaning",
    service: "Deep Clean",
    status: "completed",
    date: "2025-05-05",
    price: 220,
    address: "Villa 14, Al Olaya, Riyadh",
    notes: "",
  },
];

export const getOrders = (residentId) =>
  _orders.filter((o) => o.residentId === residentId);

export const getProviderOrders = (providerId) =>
  _orders.filter((o) => o.providerId === providerId);

export const addOrder = (order) => {
  const newOrder = {
    ...order,
    id: `ord-${Date.now()}`,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  };
  _orders = [newOrder, ..._orders];
  return newOrder;
};

export const updateOrderStatus = (orderId, status) => {
  _orders = _orders.map((o) => (o.id === orderId ? { ...o, status } : o));
};

export const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
};
