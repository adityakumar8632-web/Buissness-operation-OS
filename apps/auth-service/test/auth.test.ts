import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../src/session/token.service';
import { SessionManager } from '../src/session/session.manager';
import { requireAuth } from '../src/middleware/auth.middleware';
import { requirePermission } from '../src/middleware/rbac.guard';
import { StandardRole } from '../src/rbac/roles';
import { Permissions } from '../src/rbac/permissions';

describe('Auth Service Integration & Lifecycle', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let validAccessToken: string;
  let validRefreshToken: string;
  const testUserId = 'user-123';
  const testOrgId = 'org-456';
  const deviceId = 'device-789';

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('Session & Token Lifecycle', () => {
    it('should generate and validate a complete session context', () => {
      const sessionData = {
        userId: testUserId,
        orgId: testOrgId,
        roles: [StandardRole.ADMIN],
        deviceId: deviceId,
      };

      const tokens = SessionManager.createSession(sessionData);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();

      validAccessToken = tokens.accessToken;
      validRefreshToken = tokens.refreshToken;

      const decodedAccess = TokenService.verifyToken(validAccessToken);
      expect(decodedAccess.userId).toBe(testUserId);
      expect(decodedAccess.roles).toContain(StandardRole.ADMIN);

      const activeSession = SessionManager.validateSession(validRefreshToken);
      expect(activeSession).not.toBeNull();
      expect(activeSession?.userId).toBe(testUserId);
    });

    it('should revoke an active session successfully', () => {
      const isRevoked = SessionManager.revokeSession(validRefreshToken);
      expect(isRevoked).toBe(true);

      const activeSession = SessionManager.validateSession(validRefreshToken);
      expect(activeSession).toBeNull();
    });
  });

  describe('Authentication Middleware (requireAuth)', () => {
    it('should reject requests without an authorization header', () => {
      requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Missing or invalid authorization header' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject requests with an invalid or expired token', () => {
      mockRequest.headers = { authorization: 'Bearer invalid.token.string' };

      requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token is expired or invalid' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should authenticate valid tokens and attach user payload to the request', () => {
      const tokens = SessionManager.createSession({
        userId: testUserId,
        orgId: testOrgId,
        roles: [StandardRole.EMPLOYEE],
        deviceId: deviceId,
      });

      mockRequest.headers = { authorization: `Bearer ${tokens.accessToken}` };

      requireAuth(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect((mockRequest as Request).user).toBeDefined();
      expect((mockRequest as Request).user?.userId).toBe(testUserId);
    });
  });

  describe('RBAC Authorization Guard (requirePermission)', () => {
    it('should reject unauthenticated requests reaching the permission guard', () => {
      const guard = requirePermission(Permissions.INVENTORY_WRITE);
      guard(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication required before checking permissions' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should deny access if the user lacks the required permission', () => {
      mockRequest.user = {
        userId: testUserId,
        orgId: testOrgId,
        roles: [StandardRole.EMPLOYEE], // Employee role does not have INVENTORY_WRITE
      };

      const guard = requirePermission(Permissions.INVENTORY_WRITE);
      guard(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden: You lack the required permissions to perform this action' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should grant access if the user has the required role permission', () => {
      mockRequest.user = {
        userId: testUserId,
        orgId: testOrgId,
        roles: [StandardRole.OPERATIONS_MANAGER], // Operations Manager has INVENTORY_WRITE
      };

      const guard = requirePermission(Permissions.INVENTORY_WRITE);
      guard(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should always grant access to system administrators', () => {
      mockRequest.user = {
        userId: testUserId,
        orgId: testOrgId,
        roles: [StandardRole.ADMIN],
      };

      const guard = requirePermission(Permissions.HRMS_WRITE); // Requires specific HRMS_WRITE or ADMIN
      guard(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});