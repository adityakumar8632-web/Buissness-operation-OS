import React, { useEffect, useState } from 'react';
import { DataTable } from '@workspace/ui-kit/table';
import { Button } from '@workspace/ui-kit/button';
import { Modal } from '@workspace/ui-kit/modal';
import { AsyncLoader, EmptyState } from '@workspace/ui-kit/states';
import { apiClient } from '@workspace/api-client';

export const OutboundWebhooks: React.FC = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const loadEndpoints = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/developers/webhooks');
      setEndpoints(res.data);
    } catch (error) {
      console.error('Failed to load webhook endpoints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEndpoints();
  }, []);

  const handleRegister = async () => {
    await apiClient.post('/api/developers/webhooks', { url: newUrl, events: selectedEvents });
    setModalOpen(false);
    setNewUrl('');
    setSelectedEvents([]);
    loadEndpoints();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await apiClient.put(`/api/developers/webhooks/${id}`, { active: !currentStatus });
    loadEndpoints();
  };

  const columns = [
    { header: 'Endpoint URL', accessor: 'url' },
    { header: 'Subscribed Events', accessor: (row: any) => row.events.join(', ') },
    { header: 'Status', accessor: (row: any) => (row.active ? 'Active' : 'Paused') },
    { header: 'Created', accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <Button variant="outline" size="sm" onClick={() => handleToggleActive(row.id, row.active)}>
          {row.active ? 'Pause' : 'Activate'}
        </Button>
      ) 
    },
  ];

  if (isLoading) return <AsyncLoader text="Loading registered webhooks..." />;

  return (
    <div className="outbound-webhooks-container p-6 bg-white border rounded shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Webhook Endpoints</h2>
          <p className="text-sm text-gray-500">Interface for registering customer endpoints listening for Business OS events[cite: 3].</p>
        </div>
        <Button variant="solid" onClick={() => setModalOpen(true)}>Add Endpoint</Button>
      </div>

      {endpoints.length === 0 ? (
        <EmptyState title="No Webhooks Configured" message="Register an endpoint to start receiving real-time event payloads." icon="Webhook" />
      ) : (
        <DataTable data={endpoints} columns={columns} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Register Webhook Endpoint">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payload URL</label>
            <input 
              type="url" 
              className="w-full border-gray-300 rounded" 
              placeholder="https://your-domain.com/webhooks/business-os"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Events to Send</label>
            <select 
              multiple 
              className="w-full border-gray-300 rounded h-32"
              value={selectedEvents}
              onChange={(e) => setSelectedEvents(Array.from(e.target.selectedOptions, option => option.value))}
            >
              <option value="*">All Events (Wildcard)</option>
              <option value="crm.deal.won">Deal Won</option>
              <option value="inventory.stock.low">Low Stock Alert</option>
              <option value="billing.invoice.paid">Invoice Paid</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold CMD/Ctrl to select multiple events.</p>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="solid" onClick={handleRegister} disabled={!newUrl || selectedEvents.length === 0}>Save Endpoint</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};