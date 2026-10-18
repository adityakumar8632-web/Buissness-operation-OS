import React, { useEffect, useState } from 'react';
import { AsyncLoader } from '@workspace/ui-kit/states';
import { apiClient } from '@workspace/api-client';
import { WidgetGrid } from './WidgetGrid';

export const ExecutiveOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const [mrrData, cashflowData, revenueTrend] = await Promise.all([
          apiClient.get('/api/analytics/mrr'),
          apiClient.get('/api/analytics/cashflow'),
          apiClient.get('/api/analytics/trends/revenue')
        ]);
        
        setData({
          mrr: mrrData.data,
          cashflow: cashflowData.data,
          revenueTrend: revenueTrend.data
        });
      } catch (error) {
        console.error('Failed to load executive KPIs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (isLoading) return <AsyncLoader text="Compiling executive overview..." />;
  if (!data) return <div className="p-4 text-red-500">Failed to load analytics engine.</div>;

  return (
    <div className="executive-overview p-8 max-w-7xl mx-auto">
      <div className="header mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Executive Overview</h1>
        <div className="date-filter text-sm text-gray-500">
          Last 30 Days (Trailing)
        </div>
      </div>
      
      {/* High-level viewport summarizing operating margins, burn rate, and top-line revenue[cite: 3]. */}
      <WidgetGrid data={data} />
    </div>
  );
};