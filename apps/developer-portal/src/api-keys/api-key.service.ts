import { db } from '@workspace/database';
import crypto from 'crypto';

export class ApiKeyService {
  /**
   * Generates a new API key, securely hashes it for storage, and returns the raw key ONCE to the user.
   * Securely hashes API tokens in storage and authenticates incoming external API requests[cite: 3].
   */
  static async createKey(organizationId: string, createdBy: string, name: string, scopes: string[]): Promise<{ rawKey: string, keyId: string }> {
    const rawKey = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const prefix = rawKey.substring(0, 12); // To help users identify keys in the UI
    
    const record = await db.apiKey.create({
      data: {
        organizationId,
        createdBy,
        name,
        prefix,
        hash,
        scopes,
        active: true,
        lastUsedAt: null,
      }
    });

    return { rawKey, keyId: record.id };
  }

  static async revokeKey(keyId: string, organizationId: string): Promise<void> {
    await db.apiKey.update({
      where: { id: keyId, organizationId },
      data: { active: false, revokedAt: new Date() }
    });
  }
}