import { api } from '../lib/api';
import type { ApiResponse } from '../types';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  fullName: string;
  email: string;
  tenantId: string;
  tenantName: string;
  roles: string[];
}

export const authService = {
  login: (tenantSlug: string, email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/login', { tenantSlug, email, password }),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/refresh', { refreshToken }),

  registerTenant: (data: {
    clinicName: string; slug: string; ownerName: string;
    email: string; password: string; phone?: string;
  }) => api.post<ApiResponse<AuthResponse>>('/api/auth/tenant/register', data),
};
