import React, { useEffect, useState } from 'react';
import { DataTable, AsyncLoader } from '@business-os/ui-kit';
import { apiClient } from '@business-os/api-client';

interface AuditLog {
  id: string;
  timestamp: string | Date;
  actorId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
}

export const AuditLogTable: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await apiClient.get<{ data: AuditLog[] }>('/api/audit/logs?limit=50');
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch audit logs', error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchLogs();
  }, []);

  if (isLoading) return <AsyncLoader message="Loading audit logs..." />;

  const columns = [
    { key: 'timestamp', header: 'Timestamp', render: (row: AuditLog) => new Date(row.timestamp).toLocaleString() },
    { key: 'actorId', header: 'Actor (User)' },
    { key: 'action', header: 'Action' },
    { key: 'resource', header: 'Resource', render: (row: AuditLog) => `${row.resource} (${row.resourceId})` },
    { key: 'ipAddress', header: 'IP Address' },
  ];

  return (
    <div className="audit-log-container p-6 bg-white rounded shadow-sm border">
      <h2 className="text-xl font-bold mb-4">System Audit Logs</h2>
      <DataTable data={logs} columns={columns} />
    </div>
  );
};
