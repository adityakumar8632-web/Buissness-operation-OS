import React, { useEffect, useState } from 'react';
import { LeadService } from './lead.service';
import { Lead } from './lead.schema';

interface LeadDetailProps {
  leadId: string;
}

export function LeadDetail({ leadId }: LeadDetailProps) {
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    LeadService.getLeadById(leadId).then(setLead);
  }, [leadId]);

  if (!lead) return <div>Loading lead details...</div>;

  const handleQualify = async () => {
    await LeadService.updateLeadStatus(lead.id as string, 'QUALIFIED');
    setLead({ ...lead, status: 'QUALIFIED' });
  };

  return (
    <div className="lead-detail" style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>{lead.firstName} {lead.lastName}</h2>
          <p style={{ color: '#6b7280' }}>{lead.companyName} • {lead.email}</p>
        </div>
        <button 
          onClick={handleQualify}
          disabled={lead.status === 'QUALIFIED'}
          style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Mark as Qualified
        </button>
      </header>
      
      <section>
        <h3>Lead Status: {lead.status}</h3>
        {lead.notes && <p><strong>Notes:</strong> {lead.notes}</p>}
      </section>
    </div>
  );
}