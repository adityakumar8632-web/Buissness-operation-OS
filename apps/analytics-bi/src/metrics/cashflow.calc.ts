import { db } from '@workspace/database';

export class CashflowCalculator {
  /**
   * Combines accounts receivable and payable to project near-term cash runway[cite: 3].
   */
  static async projectCashflow(daysToProject: number = 30): Promise<{ runway: number, projectedBalance: number }> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysToProject);

    const currentBankBalance = await this.getCurrentBankBalance(); // Mocked internal balance aggregator

    const incomingInvoices = await db.invoice.aggregate({
      where: {
        status: 'UNPAID',
        type: 'RECEIVABLE',
        dueDate: { lte: futureDate }
      },
      _sum: { totalAmount: true }
    });

    const outgoingBills = await db.invoice.aggregate({
      where: {
        status: 'UNPAID',
        type: 'PAYABLE',
        dueDate: { lte: futureDate }
      },
      _sum: { totalAmount: true }
    });

    const projectedInflows = Number(incomingInvoices._sum.totalAmount || 0);
    const projectedOutflows = Number(outgoingBills._sum.totalAmount || 0);

    const projectedBalance = currentBankBalance + projectedInflows - projectedOutflows;
    
    // Average daily burn rate based on past 30 days
    const past30DaysOutflow = await this.getHistoricalOutflow(30);
    const dailyBurnRate = past30DaysOutflow / 30;

    const runway = dailyBurnRate > 0 ? Math.floor(projectedBalance / dailyBurnRate) : 999;

    return { runway, projectedBalance };
  }

  private static async getCurrentBankBalance(): Promise<number> {
    // Implementation would integrate with a Plaid-like service or ledger balance
    return 150000.00; 
  }

  private static async getHistoricalOutflow(days: number): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const paidExpenses = await db.payment.aggregate({
      where: {
        type: 'EXPENSE',
        status: 'COMPLETED',
        createdAt: { gte: cutoff }
      },
      _sum: { amount: true }
    });
    return Number(paidExpenses._sum.amount || 0);
  }
}