import { db } from '@workspace/database';

export class RetentionPolicy {
  /**
   * Enforces automated data pruning or archival once regulatory lifespans expire[cite: 3].
   */
  static async executePruning(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 7); // Example: 7-year retention policy

    const result = await db.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
        legalHold: false // Ensure logs under legal hold are not deleted
      }
    });

    return result.count;
  }
}