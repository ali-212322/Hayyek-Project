import ENV from "../config/env";

/**
 * Logger Utility
 * Centralized logging for the application
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const CURRENT_LEVEL = LOG_LEVELS[ENV.LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO;

const logger = {
  error: (message, data = null) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, data);
    }
  },

  warn: (message, data = null) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  info: (message, data = null) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, data);
    }
  },

  debug: (message, data = null) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },

  log: (message, data = null) => {
    if (ENV.ENABLE_LOGGING) {
      console.log(`[LOG] ${message}`, data);
    }
  },
};

export default logger;
