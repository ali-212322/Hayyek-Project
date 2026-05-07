import { useState, useCallback, useEffect } from "react";
import api from "../services/api";

/**
 * useAuth Hook
 * Manages authentication state and provides auth methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData.data || userData);
          setIsAuthenticated(true);
        } catch (err) {
          // Token is invalid, clear it
          api.clearToken();
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.register(userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(credentials);
      const { access, refresh, user: userData } = response.data || response;

      // Store tokens
      api.setToken(access);
      localStorage.setItem("refresh_token", refresh);

      // Set user data
      setUser(userData);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      api.clearToken();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const sendOTP = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.sendOTP(phone);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (phone, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.verifyOTP(phone, otp);
      const { access, refresh, user: userData } = response.data || response;

      // Store tokens
      api.setToken(access);
      localStorage.setItem("refresh_token", refresh);

      // Set user data
      setUser(userData);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateProfile(userData);
      const updatedUser = response.data || response;
      setUser(updatedUser);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    sendOTP,
    verifyOTP,
    updateProfile,
  };
};

export default useAuth;
