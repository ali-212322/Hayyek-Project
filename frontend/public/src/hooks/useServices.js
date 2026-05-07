import { useState, useCallback } from "react";
import api from "../services/api";

/**
 * useServices Hook
 * Manages service-related data and operations
 */
export const useServices = () => {
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getCategories();
      const data = response.data || response;
      setCategories(Array.isArray(data) ? data : data.results || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchServices = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchServices(filters);
      const data = response.data || response;
      setServices(Array.isArray(data) ? data : data.results || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getService = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getService(id);
      const data = response.data || response;
      setService(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = useCallback(async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.createService(serviceData);
      const data = response.data || response;
      setService(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateService = useCallback(async (id, serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateService(id, serviceData);
      const data = response.data || response;
      setService(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteService = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.deleteService(id);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    services,
    service,
    categories,
    loading,
    error,
    getCategories,
    searchServices,
    getService,
    createService,
    updateService,
    deleteService,
  };
};

export default useServices;
