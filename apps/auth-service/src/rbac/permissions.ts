export const Permissions = {
  // Inventory
  INVENTORY_READ: 'inventory:read',
  INVENTORY_WRITE: 'inventory:write',
  
  // Billing & Finance
  BILLING_READ: 'billing:read',
  BILLING_WRITE: 'billing:write',
  
  // CRM
  CRM_READ: 'crm:read',
  CRM_WRITE: 'crm:write',
  
  // Workforce
  HRMS_READ: 'hrms:read',
  HRMS_WRITE: 'hrms:write',
  
  // Administration
  SYSTEM_ADMIN: 'system:admin',
  AUDIT_READ: 'audit:read'
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];