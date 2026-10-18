import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimeseriesDataPoint } from '@workspace/types/analytics';

interface WidgetGridProps {
  data: {
    mrr: { totalMRR: number, netRetentionRate: number };
    cashflow: { runway: number, projectedBalance: number };
    revenueTrend: TimeseriesDataPoint[];
  };
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({ data }) => {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="widget-grid grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* KPI Card: MRR */}
      <div className="kpi-card bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total MRR</h3>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(data.mrr.totalMRR)}</p>
        <span className={`text-sm mt-2 font-medium ${data.mrr.netRetentionRate >= 100 ? 'text-green-600' : 'text-red-600'}`}>
          NRR: {data.mrr.netRetentionRate.toFixed(1)}%
        </span>
      </div>

      {/* KPI Card: Runway */}
      <div className="kpi-card bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Est. Cash Runway</h3>
        <p className="text-3xl font-bold text-gray-900">{data.cashflow.runway} days</p>
        <span className="text-sm mt-2 text-gray-500">
          Proj. Balance: {formatCurrency(data.cashflow.projectedBalance)}
        </span>
      </div>

      {/* Primary Chart Widget */}
      <div className="chart-widget bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Revenue Trend (30 Days)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="timestamp" tickFormatter={(timeStr) => new Date(timeStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => new Date(label).toLocaleDateString()} />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};