import React from 'react';
import { Deal } from './pipeline.service';

interface DealCardProps {
  deal: Deal;
  onDragStart: (e: React.DragEvent, dealId: string) => void;
}

export function DealCard({ deal, onDragStart }: DealCardProps) {
  return (
    <div 
      className="deal-card"
      draggable
      onDragStart={(e) => onDragStart(e, deal.id as string)}
      style={cardStyles.container}
    >
      <h4 style={cardStyles.title}>{deal.title}</h4>
      <div style={cardStyles.metrics}>
        <span style={cardStyles.value}>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency || 'USD', maximumFractionDigits: 0 }).format(deal.value)}
        </span>
        <span style={cardStyles.probability}>{deal.probability}%</span>
      </div>
      <div style={cardStyles.footer}>
        <span style={cardStyles.rep}>👤 {deal.assignedRep}</span>
      </div>
    </div>
  );
}

const cardStyles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    cursor: 'grab',
    marginBottom: '8px',
  },
  title: { margin: '0 0 8px 0', fontSize: '14px', color: '#111827' },
  metrics: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  value: { fontWeight: 'bold', fontSize: '14px', color: '#10b981' },
  probability: { fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '12px' },
  footer: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' },
  rep: { display: 'flex', alignItems: 'center', gap: '4px' }
};