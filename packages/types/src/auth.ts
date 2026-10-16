export type Role = 'Admin' | 'OperationsManager' | 'Auditor' | 'StandardUser';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  orgId: string;
  exp: number;
  iat: number;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  device: string;
  ipAddress: string;
  lastActive: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}