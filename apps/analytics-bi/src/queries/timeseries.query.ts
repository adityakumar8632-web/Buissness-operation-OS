import { AggregationBuilder } from './aggregation.builder';
import type { TimeseriesDataPoint } from '@workspace/types/analytics';

export class TimeseriesQuery {
  /**
   * Standard query builder generating day-over-day and month-over-month trend series[cite: 3].
   */
  static async getRevenueTrend(startDate: Date, endDate: Date): Promise<TimeseriesDataPoint[]> {
    const results = await AggregationBuilder.sumByDateGroup(
      'Invoice',
      'totalAmount',
      'paidAt',
      startDate,
      endDate,
      'day'
    );

    return (results as any[]).map(row => ({
      timestamp: new Date(row.period).toISOString(),
      value: Number(row.value)
    }));
  }
}