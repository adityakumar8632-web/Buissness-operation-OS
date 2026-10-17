import { z } from 'zod';

export const ShiftStatusEnum = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'MISSED']);

export const ShiftSchema = z.object({
  id: z.string().uuid().optional(),
  employeeId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: ShiftStatusEnum.default('SCHEDULED'),
});

export const TimeEntrySchema = z.object({
  id: z.string().uuid().optional(),
  employeeId: z.string(),
  shiftId: z.string().optional(),
  date: z.string(),
  punchIn: z.string(),
  punchOut: z.string().optional(),
  totalHours: z.number().optional(),
  isOvertime: z.boolean().default(false)
});

export type Shift = z.infer<typeof ShiftSchema>;
export type TimeEntry = z.infer<typeof TimeEntrySchema>;

export class AttendanceService {
  static async getTimesheet(employeeId: string, startDate: string, endDate: string): Promise<TimeEntry[]> {
    // Simulated API fetch returning logged hours within a date range
    return [
      { id: 'te-1', employeeId, date: '2026-10-12', punchIn: '09:00', punchOut: '17:00', totalHours: 8 },
      { id: 'te-2', employeeId, date: '2026-10-13', punchIn: '09:15', punchOut: '17:30', totalHours: 8.25 },
      { id: 'te-3', employeeId, date: '2026-10-14', punchIn: '08:50', punchOut: '19:00', totalHours: 10.16, isOvertime: true }
    ];
  }

  static async getSchedule(departmentId?: string): Promise<Shift[]> {
    // Simulated API fetch for the visual roster interface
    return [
      { id: 'sh-1', employeeId: 'emp-001', date: '2026-10-15', startTime: '09:00', endTime: '17:00', status: 'SCHEDULED' },
      { id: 'sh-2', employeeId: 'emp-002', date: '2026-10-15', startTime: '10:00', endTime: '18:00', status: 'SCHEDULED' }
    ];
  }

  static calculateHours(punchIn: string, punchOut: string): number {
    const start = new Date(`1970-01-01T${punchIn}:00Z`);
    const end = new Date(`1970-01-01T${punchOut}:00Z`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
}