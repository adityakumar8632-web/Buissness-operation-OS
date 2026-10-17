import { z } from 'zod';

export const ContactSchema = z.object({
  id: z.string().uuid().optional(),
  accountId: z.string().uuid(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  roleDesignation: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export type Contact = z.infer<typeof ContactSchema>;

export class ContactService {
  static async getContactsByAccount(accountId: string): Promise<Contact[]> {
    // Simulated API fetch returning points of contact for an account
    return [
      { id: 'c1', accountId, firstName: 'Sarah', lastName: 'Connor', email: 'sarah@skynet.com', roleDesignation: 'CTO', isPrimary: true },
      { id: 'c2', accountId, firstName: 'John', lastName: 'Connor', email: 'john@skynet.com', roleDesignation: 'Operations Lead', isPrimary: false }
    ];
  }

  static async getAllContacts(): Promise<Contact[]> {
    // Simulated API fetch for the global rolodex
    return [
      { id: 'c1', accountId: 'a1', firstName: 'Sarah', lastName: 'Connor', email: 'sarah@skynet.com', roleDesignation: 'CTO', isPrimary: true },
      { id: 'c3', accountId: 'a2', firstName: 'Miles', lastName: 'Dyson', email: 'miles@cyberdyne.com', roleDesignation: 'Lead Engineer', isPrimary: true }
    ];
  }

  static async createContact(data: unknown): Promise<Contact> {
    const validContact = ContactSchema.parse(data);
    return { ...validContact, id: crypto.randomUUID() };
  }

  static async updateContactInfo(id: string, updates: Partial<Contact>): Promise<void> {
    // Simulated PATCH request
    console.log(`Updated contact ${id} with:`, updates);
  }
}