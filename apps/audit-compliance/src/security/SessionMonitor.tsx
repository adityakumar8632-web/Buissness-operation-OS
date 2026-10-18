import React, { useEffect, useState } from 'react';
import { DataTable } from '@workspace/ui-kit/table';
import { Button } from '@workspace/ui-kit/button';
import { apiClient } from '@workspace/api-client';

export const SessionMonitor: React.FC = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await apiClient.get('/api/security/sessions/active');
      setSessions(response.data);
    };
    fetchSessions();
  }, []);

  const revokeSession = async (sessionId: string) => {
    await apiClient.post(`/api/security/sessions/${sessionId}/revoke`);
    setSessions(prev => prev.filter((s: any) => s.id !== sessionId));
  };

  const columns = [
    { header: 'User ID', accessor: 'userId' },
    { header: 'IP Address', accessor: 'ipAddress' },
    { header: 'Device / Agent', accessor: 'userAgent' },
    { header: 'Started At', accessor: (row: any) => new Date(row.createdAt).toLocaleString() },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <Button variant="outline" size="sm" onClick={() => revokeSession(row.id)}>Revoke</Button>
      ) 
    },
  ];

  return (
    <div className="session-monitor p-6 bg-white rounded shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
      {/* Administrative UI displaying currently active login sessions across all users[cite: 3]. */}
      <DataTable data={sessions} columns={columns} />
    </div>
  );
};