import { db } from '@workspace/database';
import { ApplicationError } from '@workspace/api-client/errors';
import type { ShipmentTrackingEvent, CarrierWebhookPayload } from '@workspace/types/inventory';

export class ShippingService {
  /**
   * Retrieves the full tracking history for a given Airway Bill (AWB).
   */
  static async getShipmentJourney(trackingNumber: string): Promise<ShipmentTrackingEvent[]> {
    const awb = await db.awbRecord.findUnique({
      where: { trackingNumber },
      include: {
        trackingEvents: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!awb) {
      throw new ApplicationError('Tracking number not found', 404);
    }

    return awb.trackingEvents;
  }

  /**
   * Processes incoming webhook payloads from external freight couriers.
   * Maps external statuses to internal states and triggers exception notifications if needed.
   */
  static async processCarrierUpdate(payload: CarrierWebhookPayload): Promise<void> {
    return db.$transaction(async (tx) => {
      const { trackingNumber, status, location, timestamp, message, isException } = payload;

      const awb = await tx.awbRecord.findUnique({
        where: { trackingNumber },
        include: { order: true }
      });

      if (!awb) {
        // Log unmatched webhook for auditing, but don't fail the transaction
        console.warn(`Received webhook for unknown AWB: ${trackingNumber}`);
        return;
      }

      // Record the tracking milestone
      await tx.shipmentTrackingEvent.create({
        data: {
          awbId: awb.id,
          status,
          location,
          message,
          isException: !!isException,
          timestamp: new Date(timestamp),
        }
      });

      // Update high-level order fulfillment status based on terminal carrier states
      if (status === 'DELIVERED') {
        await tx.salesOrder.update({
          where: { id: awb.orderId },
          data: { fulfillmentStatus: 'DELIVERED' }
        });
      }

      // Trigger notification workflow if the carrier reports an exception (e.g., damaged, lost, delayed)
      if (isException) {
        await tx.workflowEvent.create({
          data: {
            eventType: 'SHIPPING_EXCEPTION',
            referenceId: awb.orderId,
            payload: { trackingNumber, message, location }
          }
        });
      }
    });
  }
}