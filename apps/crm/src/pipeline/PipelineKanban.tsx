import React, { useEffect, useState } from 'react';
import { PipelineService, Deal, DealStage, DealStageEnum } from './pipeline.service';
import { DealCard } from './DealCard';

export function PipelineKanban() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forecast, setForecast] = useState(0);

  const stages = DealStageEnum.options;

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    const data = await PipelineService.getDeals();
    setDeals(data);
    setForecast(PipelineService.calculateForecast(data));
    setIsLoading(false);
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDrop = async (e: React.DragEvent, newStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    
    // Optimistic UI update
    const updatedDeals = deals.map(deal => 
      deal.id === dealId ? { ...deal, stage: newStage } : deal
    );
    setDeals(updatedDeals);
    setForecast(PipelineService.calculateForecast(updatedDeals));

    // Persist change
    await PipelineService.updateDealStage(dealId, newStage);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  if (isLoading) return <div>Loading pipeline...</div>;

  return (
    <div className="pipeline-kanban" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Sales Pipeline</h2>
        <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
          Weighted Forecast: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(forecast)}
        </div>
      </header>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', flex: 1, paddingBottom: '16px' }}>
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div 
              key={stage}
              onDrop={(e) => handleDrop(e, stage)}
              onDragOver={handleDragOver}
              style={{ minWidth: '280px', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: '500', color: '#374151' }}>
                <span>{stage} ({stageDeals.length})</span>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  ${(stageTotal / 1000).toFixed(1)}k
                </span>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {stageDeals.map(deal => (
                  <DealCard key={deal.id} deal={deal} onDragStart={handleDragStart} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}