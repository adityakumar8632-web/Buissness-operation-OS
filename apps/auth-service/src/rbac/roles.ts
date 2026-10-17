export enum StandardRole {
  ADMIN = 'Admin',
  OPERATIONS_MANAGER = 'Operations Manager',
  SALES_REP = 'Sales Representative',
  AUDITOR = 'Auditor',
  EMPLOYEE = 'Employee'
}

export type Role = `${StandardRole}` | string;