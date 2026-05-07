import { useState, useCallback } from "react";
import api from "../services/api";

/**
 * useOrders Hook
 * Manages order-related data and operations
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.createOrder(orderData);
      const data = response.data || response;
      setOrder(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getOrders(filters);
      const data = response.data || response;
      setOrders(Array.isArray(data) ? data : data.results || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getOrder(id);
      const data = response.data || response;
      setOrder(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.acceptOrder(id);
      const data = response.data || response;
      setOrder(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectOrder = useCallback(async (id, reason = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.rejectOrder(id, reason);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateOrderStatus(id, status);
      const data = response.data || response;
      setOrder(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.cancelOrder(id);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    order,
    loading,
    error,
    createOrder,
    getOrders,
    getOrder,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    cancelOrder,
  };
};

export default useOrders;
