import { db } from '@workspace/database';
import crypto from 'crypto';

export class HashVerifier {
  /**
   * Cryptographic validation service checking SHA-256 integrity chains to guarantee logs remain untampered[cite: 3].
   */
  static async verifyChain(limit: number = 1000): Promise<{ valid: boolean; brokenAt?: string }> {
    const logs = await db.auditLog.findMany({
      orderBy: { timestamp: 'asc' },
      take: limit,
    });

    for (let i = 1; i < logs.length; i++) {
      const current = logs[i];
      const previous = logs[i - 1];

      if (current.previousHash !== previous.hash) {
        return { valid: false, brokenAt: current.id };
      }

      const rawData = `${current.actorId}|${current.action}|${current.resource}|${current.resourceId}|${current.timestamp.toISOString()}|${JSON.stringify(current.payload)}|${current.previousHash}`;
      const expectedHash = crypto.createHash('sha256').update(rawData).digest('hex');

      if (current.hash !== expectedHash) {
        return { valid: false, brokenAt: current.id };
      }
    }

    return { valid: true };
  }
}