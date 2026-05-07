import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import api from "../services/api";

/**
 * Authentication Context
 * Provides global authentication state management
 */

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          dispatch({ type: "AUTH_START" });
          const userData = await api.getCurrentUser();
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              user: userData.data || userData,
              token,
            },
          });
        } catch (err) {
          api.clearToken();
          dispatch({
            type: "AUTH_ERROR",
            payload: err.message,
          });
        }
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.login(credentials);
      const { access, refresh, user } = response.data || response;

      api.setToken(access);
      localStorage.setItem("refresh_token", refresh);

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token: access },
      });

      return response;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.message,
      });
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.register(userData);
      return response;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.message,
      });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: "AUTH_START" });
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      api.clearToken();
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await api.updateProfile(userData);
      const updatedUser = response.data || response;
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: updatedUser, token: state.token },
      });
      return response;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.message,
      });
      throw err;
    }
  }, [state.token]);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
