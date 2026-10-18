import { db } from '@workspace/database';
import { ApplicationError } from '@workspace/api-client/errors';

export class AnomalyDetector {
  /**
   * Scans authentication records to flag suspicious activity like impossible travel speeds or brute-force attempts[cite: 3].
   */
  static async detectBruteForce(userId: string, timeWindowMinutes: number = 15, maxAttempts: number = 5): Promise<boolean> {
    const cutoff = new Date(Date.now() - timeWindowMinutes * 60000);
    
    const failedAttempts = await db.authLog.count({
      where: {
        userId,
        success: false,
        timestamp: { gte: cutoff }
      }
    });

    if (failedAttempts >= maxAttempts) {
      await db.securityAlert.create({
        data: {
          userId,
          type: 'BRUTE_FORCE_DETECTED',
          severity: 'HIGH',
          message: `Detected ${failedAttempts} failed login attempts in ${timeWindowMinutes} minutes.`
        }
      });
      return true;
    }
    return false;
  }
}