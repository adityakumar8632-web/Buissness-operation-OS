import React, { useEffect, useState } from 'react';
import { AttendanceService, TimeEntry } from './attendance.service';

interface TimesheetGridProps {
  employeeId: string;
}

export function TimesheetGrid({ employeeId }: TimesheetGridProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AttendanceService.getTimesheet(employeeId, '2026-10-12', '2026-10-18').then(data => {
      setEntries(data);
      setIsLoading(false);
    });
  }, [employeeId]);

  if (isLoading) return <div>Loading timesheet...</div>;

  const totalWeeklyHours = entries.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Weekly Timesheet</h2>
        <div style={{ backgroundColor: '#f3f4f6', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>
          Total Hours: {totalWeeklyHours.toFixed(2)}
        </div>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>Date</th>
            <th style={{ padding: '12px 8px' }}>Punch In</th>
            <th style={{ padding: '12px 8px' }}>Punch Out</th>
            <th style={{ padding: '12px 8px', textAlign: 'right' }}>Total Hours</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Exceptions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontWeight: '500' }}>{entry.date}</td>
              <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{entry.punchIn}</td>
              <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{entry.punchOut || '--:--'}</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                {entry.totalHours?.toFixed(2) || '0.00'}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                {entry.isOvertime && (
                  <span style={{ padding: '4px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '12px' }}>
                    Overtime
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}