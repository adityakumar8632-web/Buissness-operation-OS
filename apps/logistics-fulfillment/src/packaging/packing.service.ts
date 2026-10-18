import { db } from '@workspace/database';
import type { OrderLineItem, PackingBox } from '@workspace/types/inventory';
import { ApplicationError } from '@workspace/api-client/errors';

export class PackagingService {
  /**
   * Recommends optimal box sizes based on total cubic volume of items.
   */
  static recommendBoxSize(items: OrderLineItem[]): string {
    const totalVolume = items.reduce((acc, item) => acc + (item.product.volume * item.quantity), 0);
    
    if (totalVolume < 1000) return 'SMALL_BOX';
    if (totalVolume < 5000) return 'MEDIUM_BOX';
    return 'LARGE_BOX';
  }

  /**
   * Verifies picked items against the sales order and seals the box, updating inventory pick-status.
   */
  static async sealPackage(orderId: string, scannedSkus: string[], boxType: string): Promise<PackingBox> {
    return db.$transaction(async (tx) => {
      const order = await tx.salesOrder.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!order) throw new ApplicationError('Order not found', 404);

      // Verify all items are accounted for (simplified validation)
      const requiredSkus = order.items.flatMap(item => Array(item.quantity).fill(item.sku));
      const isMatch = requiredSkus.length === scannedSkus.length && 
                      requiredSkus.every(sku => scannedSkus.includes(sku));

      if (!isMatch) {
        throw new ApplicationError('Scanned items do not match order requirements.', 400);
      }

      // Create packing record and queue for dispatch
      const box = await tx.packingBox.create({
        data: {
          orderId,
          boxType,
          packedAt: new Date(),
          packedBy: 'current_user_context', // Handled by auth middleware in API layer
        }
      });

      await tx.salesOrder.update({
        where: { id: orderId },
        data: { fulfillmentStatus: 'PACKED' }
      });

      await tx.dispatchQueue.create({
        data: {
          orderId,
          priority: order.priority === 'HIGH' ? 1 : 0,
          status: 'AWAITING_DISPATCH'
        }
      });

      return box;
    });
  }
}