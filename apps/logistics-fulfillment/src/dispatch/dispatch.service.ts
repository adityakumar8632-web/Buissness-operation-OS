import { apiClient } from '@workspace/api-client';
import { db } from '@workspace/database';
import type { DispatchQueueItem, CourierBookingRequest, AWBRecord } from '@workspace/types/inventory';
import { ApplicationError } from '@workspace/api-client/errors';

export class DispatchService {
  /**
   * Retrieves the current queue of packed orders awaiting courier assignment.
   */
  static async getPendingDispatchQueue(): Promise<DispatchQueueItem[]> {
    return db.dispatchQueue.findMany({
      where: { status: 'AWAITING_DISPATCH' },
      include: {
        order: { include: { shippingAddress: true } },
        packedBoxes: true,
      },
      orderBy: { priority: 'desc' },
    });
  }

  /**
   * Books a freight courier and updates the dispatch queue status.
   */
  static async bookCourier(orderId: string, courierId: string): Promise<AWBRecord> {
    return db.$transaction(async (tx) => {
      const order = await tx.dispatchQueue.findUnique({
        where: { orderId },
        include: { packedBoxes: true },
      });

      if (!order || order.status !== 'AWAITING_DISPATCH') {
        throw new ApplicationError('Order is not ready for dispatch.', 400);
      }

      // External API call to courier service
      const bookingRequest: CourierBookingRequest = {
        destination: order.order.shippingAddress,
        packages: order.packedBoxes.map(b => ({ weight: b.weight, dimensions: b.dimensions })),
        serviceLevel: 'EXPRESS'
      };

      const courierResponse = await apiClient.post<{ awbNumber: string, trackingUrl: string }>(
        `/integrations/couriers/${courierId}/book`,
        bookingRequest
      );

      // Record AWB and update status
      const awbRecord = await tx.awbRecord.create({
        data: {
          orderId,
          courierId,
          trackingNumber: courierResponse.data.awbNumber,
          trackingUrl: courierResponse.data.trackingUrl,
          generatedAt: new Date(),
        }
      });

      await tx.dispatchQueue.update({
        where: { orderId },
        data: { status: 'DISPATCHED', dispatchedAt: new Date() }
      });

      return awbRecord;
    });
  }
}