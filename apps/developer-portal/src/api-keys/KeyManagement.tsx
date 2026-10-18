import React, { useEffect, useState } from 'react';
import { DataTable } from '@workspace/ui-kit/table';
import { Button } from '@workspace/ui-kit/button';
import { apiClient } from '@workspace/api-client';
import { KeyCreateModal } from './KeyCreateModal';

export const KeyManagement: React.FC = () => {
  const [keys, setKeys] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    const res = await apiClient.get('/api/developers/keys');
    setKeys(res.data);
  };

  const handleRevoke = async (id: string) => {
    if (confirm('Are you sure? This will immediately break any integrations using this key.')) {
      await apiClient.post(`/api/developers/keys/${id}/revoke`);
      loadKeys();
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Prefix', accessor: (row: any) => `${row.prefix}••••••••••••` },
    { header: 'Created', accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
    { header: 'Last Used', accessor: (row: any) => row.lastUsedAt ? new Date(row.lastUsedAt).toLocaleDateString() : 'Never' },
    { header: 'Status', accessor: (row: any) => row.active ? 'Active' : 'Revoked' },
    { 
      header: 'Actions', 
      accessor: (row: any) => row.active && (
        <Button variant="outline" size="sm" onClick={() => handleRevoke(row.id)}>Revoke</Button>
      ) 
    },
  ];

  return (
    <div className="key-management-container p-6 bg-white border rounded">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">API Keys</h2>
          <p className="text-sm text-gray-500">Manage tokens for external application access.</p>
        </div>
        <Button variant="solid" onClick={() => setModalOpen(true)}>Generate New Key</Button>
      </div>
      
      {/* Interface where developers generate, roll, and revoke public/secret API keys[cite: 3]. */}
      <DataTable data={keys} columns={columns} />
      
      <KeyCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={loadKeys} 
      />
    </div>
  );
};