import { z } from 'zod';

export const LeadStatusEnum = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST']);

export const LeadSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  status: LeadStatusEnum.default('NEW'),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;