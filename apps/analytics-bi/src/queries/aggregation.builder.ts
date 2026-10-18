import { db, Prisma } from '@workspace/database';

export class AggregationBuilder {
  /**
   * Constructs performant analytical aggregation queries with date grouping[cite: 3].
   */
  static async sumByDateGroup(
    model: Prisma.ModelName,
    sumField: string,
    dateField: string,
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month' = 'day'
  ) {
    // Uses raw SQL for efficient time-series grouping depending on dialect (PostgreSQL assumed)
    const query = `
      SELECT 
        DATE_TRUNC('${interval}', "${dateField}") as period,
        SUM("${sumField}") as value
      FROM "${model}"
      WHERE "${dateField}" >= $1 AND "${dateField}" <= $2
      GROUP BY period
      ORDER BY period ASC;
    `;

    return db.$queryRawUnsafe(query, startDate, endDate);
  }
}