/**
 * Environment Configuration
 * Centralized configuration for API endpoints and settings
 */

const ENV = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1",
  API_TIMEOUT: process.env.REACT_APP_API_TIMEOUT || 30000,

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",

  // Feature Flags
  ENABLE_MOCK_DATA: process.env.REACT_APP_ENABLE_MOCK_DATA === "true",
  ENABLE_LOGGING: process.env.REACT_APP_ENABLE_LOGGING !== "false",

  // App Configuration
  APP_NAME: "Hayyekk",
  APP_VERSION: "1.0.0",

  // Authentication
  TOKEN_KEY: "access_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  USER_KEY: "user",

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Timeouts
  REQUEST_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // Geolocation
  DEFAULT_LATITUDE: 24.7136,
  DEFAULT_LONGITUDE: 46.6753,
  DEFAULT_RADIUS: 5, // km

  // Payment
  PAYMENT_GATEWAY: process.env.REACT_APP_PAYMENT_GATEWAY || "stripe",
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY || "",

  // Map
  MAP_API_KEY: process.env.REACT_APP_MAP_API_KEY || "",

  // Logging
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || "info",
};

export default ENV;
