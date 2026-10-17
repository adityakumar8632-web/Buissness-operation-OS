import { StandardRole } from './roles';
import { Permissions, Permission } from './permissions';

// Maps roles to their allowed permissions.
// In Phase 3, this static map could be moved to the database for dynamic configuration[cite: 1].
const RolePolicies: Record<string, Permission[]> = {
  [StandardRole.ADMIN]: Object.values(Permissions), // Admins get all permissions
  
  [StandardRole.OPERATIONS_MANAGER]: [
    Permissions.INVENTORY_READ,
    Permissions.INVENTORY_WRITE,
    Permissions.HRMS_READ
  ],
  
  [StandardRole.SALES_REP]: [
    Permissions.CRM_READ,
    Permissions.CRM_WRITE,
    Permissions.INVENTORY_READ // Can check stock but not modify
  ],
  
  [StandardRole.AUDITOR]: [
    Permissions.INVENTORY_READ,
    Permissions.BILLING_READ,
    Permissions.CRM_READ,
    Permissions.HRMS_READ,
    Permissions.AUDIT_READ
  ],
  
  [StandardRole.EMPLOYEE]: [
    Permissions.HRMS_READ
  ]
};

export class PolicyEngine {
  /**
   * Evaluates if a given list of roles grants access to the required permission.
   */
  static hasPermission(userRoles: string[], requiredPermission: Permission): boolean {
    for (const role of userRoles) {
      const rolePermissions = RolePolicies[role] || [];
      if (rolePermissions.includes(requiredPermission) || rolePermissions.includes(Permissions.SYSTEM_ADMIN)) {
        return true;
      }
    }
    return false;
  }
}