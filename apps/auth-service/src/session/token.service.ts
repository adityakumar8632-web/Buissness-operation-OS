import jwt from 'jsonwebtoken';

// In a real environment, this secret must be injected via secure configuration[cite: 1].
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_do_not_use_in_prod';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  orgId: string;
  roles: string[];
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  static generateRefreshToken(userId: string, deviceId: string): string {
    return jwt.sign({ userId, deviceId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}