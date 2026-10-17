import React, { useEffect, useState } from 'react';
import { AttendanceService, Shift } from './attendance.service';

export function ShiftScheduler() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AttendanceService.getSchedule().then(data => {
      setShifts(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading shift schedule...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Shift Scheduler</h2>
        <button style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Assign Shift
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {shifts.map(shift => (
          <div key={shift.id} style={{ padding: '16px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Emp ID: {shift.employeeId}</span>
              <span style={{ fontSize: '12px', color: '#4b5563', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '12px' }}>{shift.status}</span>
            </div>
            <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>Date: {shift.date}</p>
            <p style={{ margin: 0, fontWeight: '500', fontFamily: 'monospace' }}>{shift.startTime} - {shift.endTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}