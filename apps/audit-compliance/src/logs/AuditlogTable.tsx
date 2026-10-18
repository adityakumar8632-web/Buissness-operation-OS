import React, { useEffect, useState } from 'react';
import { DataTable } from '@workspace/ui-kit/table';
import { AsyncLoader } from '@workspace/ui-kit/states';
import { apiClient } from '@workspace/api-client';

export const AuditLogTable: React.FC = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await apiClient.get('/api/audit/logs?limit=50');
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch audit logs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (isLoading) return <AsyncLoader text="Loading audit logs..." />;

  const columns = [
    { header: 'Timestamp', accessor: (row: any) => new Date(row.timestamp).toLocaleString() },
    { header: 'Actor (User)', accessor: 'actorId' },
    { header: 'Action', accessor: 'action' },
    { header: 'Resource', accessor: (row: any) => `${row.resource} (${row.resourceId})` },
    { header: 'IP Address', accessor: 'ipAddress' }, // Filterable table showing who did what, when, and from which IP address[cite: 3].
  ];

  return (
    <div className="audit-log-container p-6 bg-white rounded shadow-sm border">
      <h2 className="text-xl font-bold mb-4">System Audit Logs</h2>
      <DataTable data={logs} columns={columns} />
    </div>
  );
};