import { useState } from 'react';
import {
  Users,
  Phone,
  FlaskConical,
} from 'lucide-react';
import { DEMO_CONTACTS } from '../data/demoData';

/**
 * Care Circle card — shows trusted contacts with name, relationship,
 * and a contact action. Labelled as sample contacts.
 */
export function CareCircleCard() {
  const [callingId, setCallingId] = useState<string | null>(null);

  const handleCall = (contactId: string, contactName: string) => {
    setCallingId(contactId);
    // Simulate brief calling state
    setTimeout(() => setCallingId(null), 3000);
    // In a real app, this would trigger a call. For the demo, we just show feedback.
    void contactName; // used for future real implementation
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon blue">
          <Users />
        </div>
        <h2>My Care Circle</h2>
      </div>

      <div className="example-data-label">
        <FlaskConical size={12} />
        Sample contacts — not real people
      </div>

      {DEMO_CONTACTS.map((contact) => (
        <div className="contact-card" key={contact.id}>
          <div className="contact-avatar" aria-hidden="true">
            {contact.initials}
          </div>
          <div className="contact-info">
            <div className="contact-name">{contact.name}</div>
            <div className="contact-relationship">{contact.relationship}</div>
          </div>
          <div className="contact-action">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => handleCall(contact.id, contact.name)}
              disabled={callingId === contact.id}
              id={`btn-call-${contact.id}`}
              aria-label={`Call ${contact.name}`}
            >
              <Phone size={16} />
              {callingId === contact.id ? 'Calling…' : 'Call'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
