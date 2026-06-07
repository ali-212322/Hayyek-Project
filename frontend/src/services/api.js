const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

class APIService {
  constructor() {
    this.token = localStorage.getItem("access_token");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  getToken() {
    return this.token || localStorage.getItem("access_token");
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { "Content-Type": "application/json", ...options.headers };

    if (this.getToken()) {
      headers["Authorization"] = `Bearer ${this.getToken()}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          throw new Error(`Server error (${response.status})`);
        }

        const details = error.error?.details;
        if (details && typeof details === "object") {
          const fieldErrors = Object.entries(details)
            .map(([field, msgs]) => {
              const msg = Array.isArray(msgs) ? msgs[0] : msgs;
              return `${field}: ${msg}`;
            })
            .join(" | ");

          throw new Error(fieldErrors || error.error?.message || "API Error");
        }

        throw new Error(
          error.error?.message ||
            error.detail ||
            error.message ||
            "API Error"
        );
      }

      if (response.status === 204) return {};
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ── Auth ──────────────────────────────────────────────────────

  async register(userData) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request("/auth/token/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async verifyOTP(phone, otp) {
    return this.request("/auth/otp/verify/", {
      method: "POST",
      body: JSON.stringify({ phone, otp_code: otp }),
    });
  }

  async sendOTP(phone) {
    return this.request("/auth/otp/send/", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  async refreshToken(refreshToken) {
    return this.request("/auth/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async logout() {
    const refresh = localStorage.getItem("refresh_token");
    return this.request("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
  }

  // ── Users ─────────────────────────────────────────────────────

  async getCurrentUser() {
    return this.request("/users/me/");
  }

  async updateProfile(userData) {
    return this.request("/users/me/", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  // ── Providers ─────────────────────────────────────────────────

  async registerProvider(providerData) {
    return this.request("/providers/register/", {
      method: "POST",
      body: JSON.stringify(providerData),
    });
  }

  async getProviders(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/providers/?${queryString}`);
  }

  async getProvider(id) {
    return this.request(`/providers/${id}/`);
  }

  async getMyProviderProfile() {
    return this.request("/providers/me/");
  }

  async updateProviderProfile(providerData) {
    return this.request("/providers/me/", {
      method: "PUT",
      body: JSON.stringify(providerData),
    });
  }

  async approveProvider(id, status = "approved") {
    return this.request(`/providers/${id}/approve/`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // ── Services ──────────────────────────────────────────────────

  async getCategories() {
    return this.request("/categories/");
  }

  async getServices(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/services/?${queryString}`);
  }

  async getMyServices(providerId) {
    return this.getServices({ provider: providerId });
  }

  async createService(serviceData) {
    return this.request("/services/create/", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  }

  async getService(id) {
    return this.request(`/services/${id}/`);
  }

  async updateService(id, serviceData) {
    return this.request(`/services/${id}/`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id) {
    return this.request(`/services/${id}/`, {
      method: "DELETE",
    });
  }

  // ── Orders ────────────────────────────────────────────────────

  async createOrder(orderData) {
    return this.request("/orders/create/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/orders/?${queryString}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}/`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status/`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel/`, {
      method: "PUT",
    });
  }

  // ── Reviews ───────────────────────────────────────────────────

  async createReview(reviewData) {
    return this.request("/reviews/create/", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  async getReviews(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/reviews/?${queryString}`);
  }

  // ── Payments ──────────────────────────────────────────────────

  async createPaymentSession(orderData) {
    return this.request("/payments/create-session/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async verifyPayment(paymentData) {
    return this.request("/payments/verify-moyasar/", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  // ── Notifications ─────────────────────────────────────────────

  async getNotifications(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/notifications/?${queryString}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: true }),
    });
  }

  async markAllNotificationsAsRead() {
    return this.request("/notifications/mark-all-read/", {
      method: "POST",
    });
  }

  // ── Admin ─────────────────────────────────────────────────────

  async getAdminUsers() {
    return this.request("/admin/users/");
  }

  async getAdminStats() {
    return this.request("/admin/stats/");
  }

  async getAdminProviders(status = "pending") {
    return this.request(`/admin/providers/?status=${status}`);
  }
}

export default new APIService();