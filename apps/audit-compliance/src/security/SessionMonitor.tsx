import React, { useEffect, useState } from 'react';
import { DataTable, Button } from '@business-os/ui-kit';
import { apiClient } from '@business-os/api-client';

interface ActiveSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string | Date;
}

export const SessionMonitor: React.FC = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await apiClient.get<{ data: ActiveSession[] }>('/api/security/sessions/active');
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch active sessions', error);
      }
    };
    void fetchSessions();
  }, []);

  const revokeSession = async (sessionId: string) => {
    await apiClient.post<void>(`/api/security/sessions/${sessionId}/revoke`, undefined);
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const columns = [
    { key: 'userId', header: 'User ID' },
    { key: 'ipAddress', header: 'IP Address' },
    { key: 'userAgent', header: 'Device / Agent' },
    { key: 'createdAt', header: 'Started At', render: (row: ActiveSession) => new Date(row.createdAt).toLocaleString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ActiveSession) => (
        <Button variant="outline" size="sm" onClick={() => void revokeSession(row.id)}>Revoke</Button>
      ),
    },
  ];

  return (
    <div className="session-monitor p-6 bg-white rounded shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
      <DataTable data={sessions} columns={columns} />
    </div>
  );
};
