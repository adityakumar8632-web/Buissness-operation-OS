import { TokenService, TokenPayload } from './token.service';

export interface SessionData {
  userId: string;
  orgId: string;
  roles: string[];
  deviceId: string;
  userAgent?: string;
  ipAddress?: string;
}

export class SessionManager {
  // In Phase 3, this will interact with Redis or the PostgreSQL database[cite: 1] to validate active sessions.
  private static activeSessions: Map<string, SessionData> = new Map();

  static createSession(data: SessionData): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = {
      userId: data.userId,
      orgId: data.orgId,
      roles: data.roles,
    };

    const accessToken = TokenService.generateAccessToken(payload);
    const refreshToken = TokenService.generateRefreshToken(data.userId, data.deviceId);

    // Track session for revocation capabilities
    this.activeSessions.set(refreshToken, data);

    return { accessToken, refreshToken };
  }

  static revokeSession(refreshToken: string): boolean {
    return this.activeSessions.delete(refreshToken);
  }

  static validateSession(refreshToken: string): SessionData | null {
    const session = this.activeSessions.get(refreshToken);
    if (!session) return null;
    
    try {
      // Ensure the refresh token itself hasn't cryptographically expired
      TokenService.verifyToken(refreshToken);
      return session;
    } catch {
      this.revokeSession(refreshToken);
      return null;
    }
  }
}