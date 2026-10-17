import React, { useEffect, useState } from 'react';
import { EmployeeService, Employee } from './employee.service';

export function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    EmployeeService.getEmployees().then(data => {
      setEmployees(data);
      setIsLoading(false);
    });
  }, []);

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading employee directory...</div>;

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Employee Directory</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Search by name or department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', width: '300px' }}
          />
          <button style={{ padding: '8px 16px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            + Add Employee
          </button>
        </div>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#4b5563' }}>
            <th style={{ padding: '12px 8px' }}>Name</th>
            <th style={{ padding: '12px 8px' }}>Job Title</th>
            <th style={{ padding: '12px 8px' }}>Department</th>
            <th style={{ padding: '12px 8px' }}>Email</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{emp.firstName} {emp.lastName}</td>
              <td style={{ padding: '12px 8px' }}>{emp.jobTitle}</td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '12px' }}>
                  {emp.department}
                </span>
              </td>
              <td style={{ padding: '12px 8px' }}>{emp.email}</td>
              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: emp.status === 'ACTIVE' ? '#dcfce7' : '#fef2f2',
                  color: emp.status === 'ACTIVE' ? '#166534' : '#991b1b'
                }}>
                  {emp.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}