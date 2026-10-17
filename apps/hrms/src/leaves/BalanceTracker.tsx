import React, { useEffect, useState } from 'react';
import { LeaveService, LeaveBalance } from './leave.service';

export function BalanceTracker({ employeeId }: { employeeId: string }) {
  const [balance, setBalance] = useState<LeaveBalance | null>(null);

  useEffect(() => {
    LeaveService.getLeaveBalances(employeeId).then(setBalance);
  }, [employeeId]);

  if (!balance) return <div>Loading balances...</div>;

  const annualRemaining = balance.annualAccrued - balance.annualUsed;
  const sickRemaining = balance.sickAccrued - balance.sickUsed;

  return (
    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
      <div style={{ flex: 1, padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#4b5563' }}>Annual Leave</h3>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827' }}>{annualRemaining} <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: 'normal' }}>days left</span></div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
          {balance.annualUsed} used of {balance.annualAccrued} accrued
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#4b5563' }}>Sick Leave</h3>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827' }}>{sickRemaining} <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: 'normal' }}>days left</span></div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
          {balance.sickUsed} used of {balance.sickAccrued} accrued
        </div>
      </div>
    </div>
  );
}