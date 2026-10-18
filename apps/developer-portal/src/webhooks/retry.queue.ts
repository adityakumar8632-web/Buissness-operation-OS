import { db } from '@workspace/database';
import { apiClient } from '@workspace/api-client';

export class WebhookRetryQueue {
  /**
   * Background job queue implementing exponential backoff when customer webhook endpoints fail[cite: 3].
   */
  static async processPendingDeliveries() {
    const now = new Date();
    
    // Fetch failed deliveries where the next scheduled retry time has passed
    const pendingDeliveries = await db.webhookDelivery.findMany({
      where: {
        status: 'PENDING',
        nextRetryAt: { lte: now },
        attempts: { lt: 5 } // Max 5 retries
      },
      include: { endpoint: true }
    });

    for (const delivery of pendingDeliveries) {
      try {
        const response = await fetch(delivery.endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-OS-Signature': 'generated-hmac-signature-here'
          },
          body: JSON.stringify(delivery.payload)
        });

        if (response.ok) {
          await db.webhookDelivery.update({
            where: { id: delivery.id },
            data: { status: 'DELIVERED', httpStatus: response.status, completedAt: new Date() }
          });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error: any) {
        const newAttempts = delivery.attempts + 1;
        const isFinalFail = newAttempts >= 5;
        
        // Exponential backoff calculation (e.g., 2min, 10min, 50min, 4hrs)
        const backoffMinutes = Math.pow(5, newAttempts); 
        const nextRetry = new Date(Date.now() + backoffMinutes * 60000);

        await db.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            attempts: newAttempts,
            status: isFinalFail ? 'FAILED' : 'PENDING',
            errorLog: error.message,
            nextRetryAt: isFinalFail ? null : nextRetry
          }
        });
      }
    }
  }
}