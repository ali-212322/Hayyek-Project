/**
 * API Service Layer
 * Handles all communication with the Django backend
 * Backend URL: http://localhost:8000/api/v1/
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

class APIService {
  constructor() {
    this.token = localStorage.getItem("access_token");
  }

  /**
   * Set the authentication token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  /**
   * Get the authentication token
   */
  getToken() {
    return this.token || localStorage.getItem("access_token");
  }

  /**
   * Clear the authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  /**
   * Make a request to the API
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.getToken()) {
      headers["Authorization"] = `Bearer ${this.getToken()}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

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
        throw new Error(error.error?.message || error.detail || error.message || "API Error");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════
  // AUTHENTICATION ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Register a new user
   * POST /auth/register/
   */
  async register(userData) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Login user
   * POST /auth/token/
   */
  async login(credentials) {
    return this.request("/auth/token/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Verify OTP
   * POST /auth/otp-verify/
   */
  async verifyOTP(phone, otp) {
    return this.request("/auth/otp/verify/", {
      method: "POST",
      body: JSON.stringify({ phone, otp_code: otp }),
    });
  }

  /**
   * Send OTP (resend)
   * POST /auth/otp/send/
   */
  async sendOTP(phone) {
    return this.request("/auth/otp/send/", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  }

  /**
   * Refresh token
   * POST /auth/token/refresh/
   */
  async refreshToken(refreshToken) {
    return this.request("/auth/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  /**
   * Logout user
   * POST /auth/logout/
   */
  async logout() {
    return this.request("/auth/logout/", {
      method: "POST",
    });
  }

  // ═══════════════════════════════════════════
  // USER ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Get current user profile
   * GET /users/me/
   */
  async getCurrentUser() {
    return this.request("/users/me/");
  }

  /**
   * Update user profile
   * PATCH /users/me/
   */
  async updateProfile(userData) {
    return this.request("/users/me/", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Update user location
   * POST /users/me/location/
   */
  async updateLocation(latitude, longitude) {
    return this.request("/users/me/location/", {
      method: "POST",
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  // ═══════════════════════════════════════════
  // PROVIDER ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Register as provider
   * POST /providers/register/
   */
  async registerProvider(providerData) {
    return this.request("/providers/register/", {
      method: "POST",
      body: JSON.stringify(providerData),
    });
  }

  /**
   * Get all providers (with filters)
   * GET /providers/?category=2&lat=24.71&lng=46.67&radius=3
   */
  async getProviders(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/providers/?${queryString}`);
  }

  /**
   * Get provider details
   * GET /providers/{id}/
   */
  async getProvider(id) {
    return this.request(`/providers/${id}/`);
  }

  /**
   * Update provider profile
   * PATCH /providers/me/
   */
  async updateProviderProfile(providerData) {
    return this.request("/providers/me/", {
      method: "PATCH",
      body: JSON.stringify(providerData),
    });
  }

  /**
   * Toggle provider availability
   * PATCH /providers/me/availability/
   */
  async toggleAvailability(isAvailable) {
    return this.request("/providers/me/availability/", {
      method: "PATCH",
      body: JSON.stringify({ is_available: isAvailable }),
    });
  }

  /**
   * Get provider earnings
   * GET /providers/me/earnings/
   */
  async getProviderEarnings(period = "month") {
    return this.request(`/providers/me/earnings/?period=${period}`);
  }

  // ═══════════════════════════════════════════
  // SERVICE ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Get all service categories
   * GET /categories/
   */
  async getCategories() {
    return this.request("/categories/");
  }

  /**
   * Search services
   * GET /services/?category=2&search=cleaning
   */
  async searchServices(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/services/?${queryString}`);
  }

  /**
   * Create a new service (provider only)
   * POST /services/
   */
  async createService(serviceData) {
    return this.request("/services/", {
      method: "POST",
      body: JSON.stringify(serviceData),
    });
  }

  /**
   * Get service details
   * GET /services/{id}/
   */
  async getService(id) {
    return this.request(`/services/${id}/`);
  }

  /**
   * Update service
   * PATCH /services/{id}/
   */
  async updateService(id, serviceData) {
    return this.request(`/services/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(serviceData),
    });
  }

  /**
   * Delete service
   * DELETE /services/{id}/
   */
  async deleteService(id) {
    return this.request(`/services/${id}/`, {
      method: "DELETE",
    });
  }

  // ═══════════════════════════════════════════
  // ORDER ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Create a new order
   * POST /orders/
   */
  async createOrder(orderData) {
    return this.request("/orders/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get all orders
   * GET /orders/
   */
  async getOrders(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/orders/?${queryString}`);
  }

  /**
   * Get order details
   * GET /orders/{id}/
   */
  async getOrder(id) {
    return this.request(`/orders/${id}/`);
  }

  /**
   * Accept an order (provider only)
   * PATCH /orders/{id}/accept/
   */
  async acceptOrder(id) {
    return this.request(`/orders/${id}/accept/`, {
      method: "PATCH",
    });
  }

  /**
   * Reject an order (provider only)
   * PATCH /orders/{id}/reject/
   */
  async rejectOrder(id, reason = "") {
    return this.request(`/orders/${id}/reject/`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Update order status
   * PATCH /orders/{id}/status/
   */
  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Cancel an order
   * PATCH /orders/{id}/cancel/
   */
  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel/`, {
      method: "PATCH",
    });
  }

  // ═══════════════════════════════════════════
  // REVIEW ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Create a review
   * POST /reviews/
   */
  async createReview(reviewData) {
    return this.request("/reviews/", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  /**
   * Get reviews for a provider
   * GET /reviews/?provider={id}
   */
  async getReviews(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/reviews/?${queryString}`);
  }

  /**
   * Get review details
   * GET /reviews/{id}/
   */
  async getReview(id) {
    return this.request(`/reviews/${id}/`);
  }

  /**
   * Update a review
   * PATCH /reviews/{id}/
   */
  async updateReview(id, reviewData) {
    return this.request(`/reviews/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(reviewData),
    });
  }

  /**
   * Delete a review
   * DELETE /reviews/{id}/
   */
  async deleteReview(id) {
    return this.request(`/reviews/${id}/`, {
      method: "DELETE",
    });
  }

  // ═══════════════════════════════════════════
  // PAYMENT ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Create a payment session
   * POST /payments/create-session/
   */
  async createPaymentSession(orderData) {
    return this.request("/payments/create-session/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Verify payment
   * POST /payments/verify/
   */
  async verifyPayment(paymentData) {
    return this.request("/payments/verify/", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  /**
   * Get payment details
   * GET /payments/{id}/
   */
  async getPayment(id) {
    return this.request(`/payments/${id}/`);
  }

  // ═══════════════════════════════════════════
  // NOTIFICATION ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Get user notifications
   * GET /notifications/
   */
  async getNotifications(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/notifications/?${queryString}`);
  }

  /**
   * Mark notification as read
   * PATCH /notifications/{id}/
   */
  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: true }),
    });
  }

  /**
   * Mark all notifications as read
   * POST /notifications/mark-all-read/
   */
  async markAllNotificationsAsRead() {
    return this.request("/notifications/mark-all-read/", {
      method: "POST",
    });
  }

  // ═══════════════════════════════════════════
  // ADMIN ENDPOINTS
  // ═══════════════════════════════════════════

  /**
   * Get all users (admin only)
   * GET /admin/users/
   */
  async getUsers(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/admin/users/?${queryString}`);
  }

  /**
   * Get provider approval requests (admin only)
   * GET /admin/providers/requests/
   */
  async getProviderRequests(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/admin/providers/requests/?${queryString}`);
  }

  /**
   * Approve provider (admin only)
   * PATCH /admin/providers/{id}/approve/
   */
  async approveProvider(id) {
    return this.request(`/admin/providers/${id}/approve/`, {
      method: "PATCH",
    });
  }

  /**
   * Reject provider (admin only)
   * PATCH /admin/providers/{id}/reject/
   */
  async rejectProvider(id, reason = "") {
    return this.request(`/admin/providers/${id}/reject/`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Get complaints (admin only)
   * GET /admin/complaints/
   */
  async getComplaints(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/admin/complaints/?${queryString}`);
  }

  /**
   * Resolve complaint (admin only)
   * PATCH /admin/complaints/{id}/resolve/
   */
  async resolveComplaint(id, resolution) {
    return this.request(`/admin/complaints/${id}/resolve/`, {
      method: "PATCH",
      body: JSON.stringify({ resolution }),
    });
  }

  /**
   * Get dashboard statistics (admin only)
   * GET /admin/statistics/
   */
  async getStatistics(period = "month") {
    return this.request(`/admin/statistics/?period=${period}`);
  }
}

export default new APIService();
