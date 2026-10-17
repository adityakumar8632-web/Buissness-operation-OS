import React, { useEffect, useState } from 'react';
import { LeadService } from './lead.service';
import { Lead } from './lead.schema';

export function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    LeadService.getLeads().then(data => {
      setLeads(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading leads...</div>;

  return (
    <div className="lead-list">
      <h2>Lead Directory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '8px 0' }}>{lead.firstName} {lead.lastName}</td>
              <td>{lead.companyName}</td>
              <td>{lead.email}</td>
              <td>
                <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                  {lead.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}