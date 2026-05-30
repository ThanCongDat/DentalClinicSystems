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
