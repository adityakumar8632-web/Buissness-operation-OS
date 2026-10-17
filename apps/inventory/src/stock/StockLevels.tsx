import React, { useEffect, useState } from 'react';
import { StockService, StockLevel } from './stock.service';
import { StockAdjustmentModal } from './StockAdjustmentModal';

export function StockLevels() {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStock = async () => {
    setIsLoading(true);
    const data = await StockService.getStockLevels();
    setStockLevels(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  if (isLoading) return <div>Loading stock levels...</div>;

  return (
    <div className="stock-levels" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Warehouse Stock Levels</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '8px 16px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Adjust Stock
        </button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>SKU</th>
            <th style={{ padding: '12px 8px' }}>Warehouse</th>
            <th style={{ padding: '12px 8px' }}>On-Hand</th>
            <th style={{ padding: '12px 8px' }}>Allocated</th>
            <th style={{ padding: '12px 8px' }}>Available</th>
            <th style={{ padding: '12px 8px' }}>Safety Stock</th>
            <th style={{ padding: '12px 8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {stockLevels.map(stock => {
            const available = stock.onHand - stock.allocated;
            const isLowStock = available < stock.safetyStock;

            return (
              <tr key={stock.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 8px', fontWeight: '500' }}>{stock.sku}</td>
                <td style={{ padding: '12px 8px', color: '#4b5563' }}>{stock.warehouseId}</td>
                <td style={{ padding: '12px 8px' }}>{stock.onHand}</td>
                <td style={{ padding: '12px 8px', color: '#ea580c' }}>{stock.allocated}</td>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{available}</td>
                <td style={{ padding: '12px 8px', color: '#6b7280' }}>{stock.safetyStock}</td>
                <td style={{ padding: '12px 8px' }}>
                  {isLowStock ? (
                    <span style={{ color: '#dc2626', fontSize: '12px', padding: '4px 8px', backgroundColor: '#fef2f2', borderRadius: '12px' }}>Low Stock</span>
                  ) : (
                    <span style={{ color: '#16a34a', fontSize: '12px', padding: '4px 8px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>Healthy</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && (
        <StockAdjustmentModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchStock();
          }}
        />
      )}
    </div>
  );
}