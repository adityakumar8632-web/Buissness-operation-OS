import { z } from 'zod';

export const EmployeeStatusEnum = z.enum(['ACTIVE', 'ONBOARDING', 'ON_LEAVE', 'TERMINATED']);
export const DepartmentEnum = z.enum(['ENGINEERING', 'SALES', 'OPERATIONS', 'HR', 'FINANCE']);

export const EmployeeSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  jobTitle: z.string(),
  department: DepartmentEnum,
  status: EmployeeStatusEnum.default('ACTIVE'),
  managerId: z.string().optional(),
  joinDate: z.string(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relation: z.string()
  }).optional()
});

export type Employee = z.infer<typeof EmployeeSchema>;

export class EmployeeService {
  static async getEmployees(): Promise<Employee[]> {
    // Simulated API fetch returning the searchable personnel directory
    return [
      {
        id: 'emp-001',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.s@company.test',
        jobTitle: 'Senior Software Engineer',
        department: 'ENGINEERING',
        status: 'ACTIVE',
        joinDate: '2023-05-15',
        emergencyContact: { name: 'Bob Smith', phone: '555-0101', relation: 'Spouse' }
      },
      {
        id: 'emp-002',
        firstName: 'David',
        lastName: 'Chen',
        email: 'david.c@company.test',
        jobTitle: 'Sales Director',
        department: 'SALES',
        status: 'ACTIVE',
        joinDate: '2022-11-01'
      }
    ];
  }

  static async getEmployeeById(id: string): Promise<Employee | null> {
    const employees = await this.getEmployees();
    return employees.find(e => e.id === id) || null;
  }

  static async updateEmployeeStatus(id: string, status: Employee['status']): Promise<void> {
    console.log(`[HRMS] Employee ${id} status updated to ${status}. Performing lifecycle checks...`);
    if (status === 'TERMINATED') {
      console.log(`[HRMS Event] Triggering offboarding tasks and revoking access...`);
    }
  }
}