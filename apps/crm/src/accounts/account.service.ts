import { z } from 'zod';

export const AccountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Account name is required"),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT']).default('PROSPECT'),
  parentAccountId: z.string().uuid().optional(), // For organizational hierarchy[cite: 3]
});

export type Account = z.infer<typeof AccountSchema>;

export class AccountService {
  static async getAccounts(): Promise<Account[]> {
    // Simulated API fetch for client enterprises[cite: 3]
    return [
      { id: 'a1', name: 'Skynet Corp', industry: 'Technology', status: 'ACTIVE' },
      { id: 'a2', name: 'Cyberdyne Systems', industry: 'Manufacturing', status: 'PROSPECT' }
    ];
  }

  static async getAccountById(id: string): Promise<Account | null> {
    const accounts = await this.getAccounts();
    return accounts.find(a => a.id === id) || null;
  }

  static async createAccount(data: unknown): Promise<Account> {
    const validAccount = AccountSchema.parse(data);
    return { ...validAccount, id: crypto.randomUUID() };
  }
}