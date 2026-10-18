import jwt from 'jsonwebtoken';

// In a real environment, this secret must be injected via secure configuration[cite: 1].
const JWT_SECRET = process.env.JWT_SECRET || 'development_secret_do_not_use_in_prod';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  orgId: string;
  roles: string[];
  type: 'access';
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      { ...payload, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  static generateRefreshToken(userId: string, deviceId: string): string {
    return jwt.sign({ userId, deviceId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  static verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      decoded.type !== 'access' ||
      typeof decoded.userId !== 'string' ||
      typeof decoded.orgId !== 'string' ||
      !Array.isArray(decoded.roles) ||
      !decoded.roles.every((role) => typeof role === 'string')
    ) {
      throw new Error('Invalid access token payload');
    }

    return decoded as TokenPayload;
  } catch {
    throw new Error('Invalid or expired access token');
  }
}

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
