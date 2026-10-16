export interface KpiCardData {
  title: string;
  value: number;
  previousValue: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'flat';
}

export interface TimeseriesDataPoint {
  timestamp: string;
  value: number;
}

export interface MetricAggregationRequest {
  metricId: string;
  startDate: string;
  endDate: string;
  interval: 'day' | 'week' | 'month';
  dimensions?: string[];
}

export interface ChartDataSeries {
  label: string;
  data: TimeseriesDataPoint[];
}