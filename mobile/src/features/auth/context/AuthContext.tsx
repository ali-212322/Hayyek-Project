import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { authApi } from '../api/authApi';
import { tokenStorage } from '../../../shared/storage/tokenStorage';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredToken() {
      const accessToken = await tokenStorage.getAccessToken();
      setIsAuthenticated(!!accessToken);
      setIsLoading(false);
    }

    loadStoredToken();
  }, []);

  async function login(phone: string, password: string) {
    const response = await authApi.login({ phone, password });
    const { access, refresh } = response.data.data;

    await tokenStorage.saveTokens(access, refresh);
    setIsAuthenticated(true);
  }

  async function logout() {
    const refresh = await tokenStorage.getRefreshToken();

    if (refresh) {
      try {
        await authApi.logout(refresh);
      } catch {
        // Clear local tokens even if backend logout fails.
      }
    }

    await tokenStorage.clearTokens();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
