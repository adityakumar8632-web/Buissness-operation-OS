import { BaseEntity } from './common';

export interface EmployeeProfile extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  managerId?: string;
  hireDate: string;
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest extends BaseEntity {
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'Annual' | 'Sick' | 'Unpaid';
  status: LeaveStatus;
}

export interface AttendanceLog extends BaseEntity {
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHoursCalculated?: number;
}