import React, { useEffect, useState } from 'react';
import { EmployeeService, Employee } from './employee.service';

interface ProfileRecordProps {
  employeeId: string;
}

export function ProfileRecord({ employeeId }: ProfileRecordProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    EmployeeService.getEmployeeById(employeeId).then(setEmployee);
  }, [employeeId]);

  if (!employee) return <div>Loading profile...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', maxWidth: '1000px' }}>
      <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', alignSelf: 'start' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#6b7280', marginBottom: '16px' }}>
          {employee.firstName[0]}{employee.lastName[0]}
        </div>
        <h2 style={{ margin: '0 0 4px 0' }}>{employee.firstName} {employee.lastName}</h2>
        <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>{employee.jobTitle}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
          <div>
            <strong style={{ display: 'block', color: '#4b5563' }}>Email</strong>
            <span>{employee.email}</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: '#4b5563' }}>Department</strong>
            <span>{employee.department}</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: '#4b5563' }}>Join Date</strong>
            <span>{employee.joinDate}</span>
          </div>
          <div>
            <strong style={{ display: 'block', color: '#4b5563' }}>Status</strong>
            <span style={{ color: employee.status === 'ACTIVE' ? '#166534' : '#991b1b', fontWeight: 'bold' }}>{employee.status}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Emergency Contact</h3>
          {employee.emergencyContact ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Name</span>
                <strong>{employee.emergencyContact.name} ({employee.emergencyContact.relation})</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Phone</span>
                <strong>{employee.emergencyContact.phone}</strong>
              </div>
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No emergency contact on file.</p>
          )}
        </div>

        <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>Job History</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Current Role: {employee.jobTitle} (Since {employee.joinDate})</p>
          {/* Timeline component mapping historical roles would go here[cite: 3] */}
        </div>
      </div>
    </div>
  );
}