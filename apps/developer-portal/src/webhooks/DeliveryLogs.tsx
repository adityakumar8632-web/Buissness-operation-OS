import React, { useEffect, useState } from 'react';
import { DataTable } from '@workspace/ui-kit/table';
import { Modal } from '@workspace/ui-kit/modal';
import { AsyncLoader } from '@workspace/ui-kit/states';
import { Button } from '@workspace/ui-kit/button';
import { apiClient } from '@workspace/api-client';

export const DeliveryLogs: React.FC = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayload, setSelectedPayload] = useState<any>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await apiClient.get('/api/developers/webhooks/logs?limit=100');
        setLogs(res.data);
      } catch (error) {
        console.error('Failed to load delivery logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns = [
    { header: 'Timestamp', accessor: (row: any) => new Date(row.createdAt).toLocaleString() },
    { header: 'Event', accessor: 'eventName' },
    { header: 'Target URL', accessor: (row: any) => row.endpoint.url },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded ${row.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.httpStatus || row.status}
        </span>
      ) 
    },
    { header: 'Attempts', accessor: 'attempts' },
    { 
      header: 'Payload', 
      accessor: (row: any) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedPayload(row.payload)}>
          Inspect
        </Button>
      ) 
    },
  ];

  if (isLoading) return <AsyncLoader text="Loading webhook delivery history..." />;

  return (
    <div className="delivery-logs-container p-6 bg-white border rounded shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Delivery Logs</h2>
        <p className="text-sm text-gray-500">Log viewer displaying HTTP status responses, payload bodies, and delivery attempts[cite: 3].</p>
      </div>

      <DataTable data={logs} columns={columns} />

      <Modal 
        isOpen={!!selectedPayload} 
        onClose={() => setSelectedPayload(null)} 
        title="Event Payload"
      >
        <div className="bg-gray-900 rounded p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
            {selectedPayload ? JSON.stringify(selectedPayload, null, 2) : ''}
          </pre>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="solid" onClick={() => setSelectedPayload(null)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};