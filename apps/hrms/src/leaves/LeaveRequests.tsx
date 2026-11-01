import React, { useEffect, useState } from 'react';
import { LeaveService, LeaveRequest } from './leave.service';

export function LeaveRequests({ employeeId }: { employeeId: string }) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    LeaveService.getLeaveRequests(employeeId).then(setRequests);
  }, [employeeId]);

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Time Off Requests</h2>
        <button style={{ padding: '8px 16px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Request Time Off
        </button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>Type</th>
            <th style={{ padding: '12px 8px' }}>Start Date</th>
            <th style={{ padding: '12px 8px' }}>End Date</th>
            <th style={{ padding: '12px 8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontWeight: '500' }}>{req.type}</td>
              <td style={{ padding: '12px 8px' }}>{req.startDate}</td>
              <td style={{ padding: '12px 8px' }}>{req.endDate}</td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: req.status === 'APPROVED' ? '#dcfce7' : (req.status === 'PENDING' ? '#fef3c7' : '#fef2f2'),
                  color: req.status === 'APPROVED' ? '#166534' : (req.status === 'PENDING' ? '#92400e' : '#991b1b')
                }}>
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}