import { useState, useCallback } from "react";
import api from "../services/api";

/**
 * useProviders Hook
 * Manages provider-related data and operations
 */
export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProviders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getProviders(filters);
      const data = response.data || response;
      setProviders(Array.isArray(data) ? data : data.results || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProvider = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getProvider(id);
      const data = response.data || response;
      setProvider(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerProvider = useCallback(async (providerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.registerProvider(providerData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProviderProfile = useCallback(async (providerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateProviderProfile(providerData);
      const data = response.data || response;
      setProvider(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAvailability = useCallback(async (isAvailable) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.toggleAvailability(isAvailable);
      const data = response.data || response;
      setProvider(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEarnings = useCallback(async (period = "month") => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getProviderEarnings(period);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    providers,
    provider,
    loading,
    error,
    getProviders,
    getProvider,
    registerProvider,
    updateProviderProfile,
    toggleAvailability,
    getEarnings,
  };
};

export default useProviders;
