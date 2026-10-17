import { z } from 'zod';

export const LeaveTypeEnum = z.enum(['ANNUAL', 'SICK', 'UNPAID', 'PARENTAL']);
export const LeaveStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);

export const LeaveRequestSchema = z.object({
  id: z.string().uuid().optional(),
  employeeId: z.string(),
  type: LeaveTypeEnum,
  startDate: z.string(),
  endDate: z.string(),
  status: LeaveStatusEnum.default('PENDING'),
  reason: z.string().optional(),
  managerId: z.string()
});

export const LeaveBalanceSchema = z.object({
  employeeId: z.string(),
  annualAccrued: z.number(),
  annualUsed: z.number(),
  sickAccrued: z.number(),
  sickUsed: z.number(),
});

export type LeaveRequest = z.infer<typeof LeaveRequestSchema>;
export type LeaveBalance = z.infer<typeof LeaveBalanceSchema>;

export class LeaveService {
  static async getLeaveBalances(employeeId: string): Promise<LeaveBalance> {
    return {
      employeeId,
      annualAccrued: 20,
      annualUsed: 5,
      sickAccrued: 10,
      sickUsed: 2,
    };
  }

  static async getLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    return [
      { id: 'lr-1', employeeId, type: 'ANNUAL', startDate: '2026-11-20', endDate: '2026-11-25', status: 'APPROVED', managerId: 'mgr-1' },
      { id: 'lr-2', employeeId, type: 'SICK', startDate: '2026-10-01', endDate: '2026-10-02', status: 'PENDING', managerId: 'mgr-1' }
    ];
  }

  static async submitLeaveRequest(data: unknown): Promise<LeaveRequest> {
    const validRequest = LeaveRequestSchema.parse(data);
    console.log(`[Leave Service] Routing approval for ${validRequest.employeeId} to manager ${validRequest.managerId}`);
    return { ...validRequest, id: crypto.randomUUID() };
  }
}