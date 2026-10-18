import { db } from '@workspace/database';

export class InventoryTurnoverCalculator {
  /**
   * Evaluates stock velocity and calculates inventory turnover ratios per warehouse[cite: 3].
   * Formula: Cost of Goods Sold (COGS) / Average Inventory Value
   */
  static async calculateTurnoverRatio(warehouseId: string, startDate: Date, endDate: Date): Promise<number> {
    const soldItems = await db.salesOrderItem.findMany({
      where: {
        order: {
          status: 'FULFILLED',
          createdAt: { gte: startDate, lte: endDate }
        },
        warehouseId
      },
      include: { product: true }
    });

    const cogs = soldItems.reduce((total, item) => {
      return total + (Number(item.product.unitCost) * item.quantity);
    }, 0);

    const startInventory = await this.getInventoryValueAtDate(warehouseId, startDate);
    const endInventory = await this.getInventoryValueAtDate(warehouseId, endDate);
    
    const averageInventoryValue = (startInventory + endInventory) / 2;

    if (averageInventoryValue === 0) return 0;
    
    return Number((cogs / averageInventoryValue).toFixed(2));
  }

  private static async getInventoryValueAtDate(warehouseId: string, date: Date): Promise<number> {
    // In production, this reconstructs historical stock balance by reversing movements from current state
    const movements = await db.stockMovement.findMany({
      where: {
        warehouseId,
        createdAt: { lte: date }
      },
      include: { product: true }
    });

    return movements.reduce((value, move) => {
      const amount = move.type === 'IN' ? move.quantity : -move.quantity;
      return value + (amount * Number(move.product.unitCost));
    }, 0);
  }
}