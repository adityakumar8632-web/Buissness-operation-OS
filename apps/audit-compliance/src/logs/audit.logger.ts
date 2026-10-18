import { db } from '@workspace/database';
import crypto from 'crypto';

export interface AuditEventPayload {
  actorId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  payload: Record<string, any>;
}

export class AuditLogger {
  /**
   * Records a mutation payload while scrubbing sensitive data (e.g., passwords)[cite: 3].
   */
  static async logEvent(event: AuditEventPayload): Promise<void> {
    const sanitizedPayload = this.sanitize(event.payload);
    
    // Fetch the previous log entry to maintain the cryptographic hash chain
    const previousLog = await db.auditLog.findFirst({
      orderBy: { timestamp: 'desc' }
    });
    
    const previousHash = previousLog ? previousLog.hash : 'GENESIS';
    const timestamp = new Date();
    
    const rawData = `${event.actorId}|${event.action}|${event.resource}|${event.resourceId}|${timestamp.toISOString()}|${JSON.stringify(sanitizedPayload)}|${previousHash}`;
    const hash = crypto.createHash('sha256').update(rawData).digest('hex');

    await db.auditLog.create({
      data: {
        ...event,
        payload: sanitizedPayload,
        timestamp,
        previousHash,
        hash
      }
    });
  }

  private static sanitize(payload: Record<string, any>): Record<string, any> {
    const sensitiveKeys = ['password', 'secret', 'token', 'creditCard'];
    const sanitized = { ...payload };
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '***REDACTED***';
      }
    }
    return sanitized;
  }
}