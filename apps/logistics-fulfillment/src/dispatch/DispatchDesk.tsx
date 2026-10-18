import React, { useEffect, useState } from 'react';
import { DataTable } from '@workspace/ui-kit/table';
import { Button } from '@workspace/ui-kit/button';
import { AsyncLoader, EmptyState } from '@workspace/ui-kit/states';
import { DispatchService } from './dispatch.service';
import type { DispatchQueueItem } from '@workspace/types/inventory';

export const DispatchDesk: React.FC = () => {
  const [queue, setQueue] = useState<DispatchQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const data = await DispatchService.getPendingDispatchQueue();
        setQueue(data);
      } catch (error) {
        console.error('Failed to load dispatch queue:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const handleBookCourier = async (orderId: string) => {
    // In production, this would open a modal to select the courier
    await DispatchService.bookCourier(orderId, 'default_courier_id');
    setQueue(prev => prev.filter(item => item.orderId !== orderId));
  };

  if (isLoading) return <AsyncLoader text="Loading dispatch queue..." />;
  if (queue.length === 0) return <EmptyState title="No pending dispatches" message="All packed orders have been dispatched." icon="BoxCheck" />;

  const columns = [
    { header: 'Order ID', accessor: 'orderId' },
    { header: 'Destination', accessor: (row: DispatchQueueItem) => row.order.shippingAddress.city },
    { header: 'Boxes', accessor: (row: DispatchQueueItem) => row.packedBoxes.length },
    { 
      header: 'Action', 
      accessor: (row: DispatchQueueItem) => (
        <Button variant="solid" size="sm" onClick={() => handleBookCourier(row.orderId)}>
          Book Courier
        </Button>
      ) 
    },
  ];

  return (
    <div className="dispatch-desk-container">
      <h2>Dispatch Desk</h2>
      <DataTable data={queue} columns={columns} />
    </div>
  );
};