import React, { useState } from 'react';
import { TrackingService, Batch } from './tracking.service';

export function BatchTracker() {
  const [batchId, setBatchId] = useState('');
  const [batchData, setBatchData] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const data = await TrackingService.getBatchDetails(batchId);
      if (data) {
        setBatchData(data);
      } else {
        setBatchData(null);
        setError('Batch/Lot not found in the system.');
      }
    } catch (err) {
      setError('An error occurred while fetching batch data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', maxWidth: '600px' }}>
      <h2 style={{ margin: '0 0 16px 0' }}>Batch & Lot Tracker</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input 
          type="text" 
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          placeholder="Enter Batch or Lot ID (e.g., LOT-2026-A1)" 
          style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {isLoading ? 'Searching...' : 'Audit Batch'}
        </button>
      </form>

      {error && <div style={{ color: '#dc2626', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '6px' }}>{error}</div>}

      {batchData && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>
            Batch Details: {batchData.id}
          </div>
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>SKU</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{batchData.skuId}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>Status</p>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '12px', 
                fontWeight: 'bold',
                backgroundColor: batchData.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                color: batchData.status === 'ACTIVE' ? '#166534' : '#92400e'
              }}>
                {batchData.status}
              </span>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>Production Date</p>
              <p style={{ margin: 0 }}>{batchData.productionDate}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>Expiration Date</p>
              <p style={{ margin: 0, color: batchData.expirationDate ? '#dc2626' : '#111827' }}>
                {batchData.expirationDate || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}