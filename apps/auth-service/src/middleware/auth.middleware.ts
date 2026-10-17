import { Request, Response, NextFunction } from 'express';
import { TokenService, TokenPayload } from '../session/token.service';

// Extend Express Request to include our custom user payload
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = TokenService.verifyToken(token);
    req.user = payload; // Attach context to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is expired or invalid' });
  }
}