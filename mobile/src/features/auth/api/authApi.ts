import { apiClient } from '../../../shared/api/client';

export type LoginPayload = {
  phone: string;
  password: string;
};

export type RegisterPayload = {
  phone: string;
  full_name: string;
  email?: string;
  role: 'resident';
  password: string;
  password_confirm: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    access: string;
    refresh: string;
  };
};

export const authApi = {
  login(payload: LoginPayload) {
    return apiClient.post<LoginResponse>('/auth/token/', payload);
  },

  register(payload: RegisterPayload) {
    return apiClient.post('/auth/register/', payload);
  },

  logout(refresh: string) {
    return apiClient.post('/auth/logout/', { refresh });
  },
};
