import { Request, Response, NextFunction } from 'express';
import { PolicyEngine } from '../rbac/policy.engine';
import { Permission } from '../rbac/permissions';

export function requirePermission(requiredPermission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Authentication required before checking permissions' });
    }

    const isAuthorized = PolicyEngine.hasPermission(user.roles, requiredPermission);

    if (!isAuthorized) {
      return res.status(403).json({ 
        error: 'Forbidden: You lack the required permissions to perform this action' 
      });
    }

    next();
  };
}