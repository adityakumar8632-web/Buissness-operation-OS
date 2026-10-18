import React, { useEffect, useState } from 'react';
import { AsyncLoader, EmptyState, ErrorBoundary } from '@workspace/ui-kit/states';
import { ShippingService } from './shipping.service';
import type { ShipmentTrackingEvent } from '@workspace/types/inventory';

interface ShipmentTrackerProps {
  trackingNumber: string;
}

export const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ trackingNumber }) => {
  const [events, setEvents] = useState<ShipmentTrackingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setIsLoading(true);
        const data = await ShippingService.getShipmentJourney(trackingNumber);
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load tracking data.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (trackingNumber) {
      fetchJourney();
    }
  }, [trackingNumber]);

  if (isLoading) return <AsyncLoader text="Fetching live tracking updates..." />;
  if (error) return <div className="text-red-600 p-4 bg-red-50 rounded-md border border-red-200">{error}</div>;
  if (events.length === 0) return <EmptyState title="No Tracking Data" message="The carrier has not reported any scans yet." icon="Box" />;

  return (
    <ErrorBoundary>
      <div className="shipment-tracker-timeline max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-6 border-b pb-4">Tracking Journey: {trackingNumber}</h3>
        <div className="relative pl-4 border-l-2 border-gray-200 space-y-8">
          {events.map((event, index) => {
            const isLatest = index === 0;
            return (
              <div key={event.id} className="relative">
                <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 border-white ${isLatest ? 'bg-blue-600' : (event.isException ? 'bg-red-500' : 'bg-gray-400')}`} />
                <div className="ml-4">
                  <span className="text-xs font-mono text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                  <h4 className={`text-md font-semibold mt-1 ${event.isException ? 'text-red-600' : 'text-gray-900'}`}>
                    {event.status}
                  </h4>
                  {event.location && (
                    <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                  )}
                  {event.message && (
                    <p className="text-sm text-gray-500 mt-1 italic">{event.message}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
};