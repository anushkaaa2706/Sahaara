import { useState } from 'react';
import {
  Users,
  Phone,
  FlaskConical,
  Plus,
  X,
  UserRound,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_CONTACTS } from '../data/demoData';

type CareContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  initials: string;
};

export function CareCircleCard() {
  const [contacts, setContacts] = useState<CareContact[]>(
    DEMO_CONTACTS.map((contact) => ({
      ...contact,
      phone: 'Not provided',
    }))
  );
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState('');

  function handleAddContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanRelationship = relationship.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanRelationship || !cleanPhone) {
      setFeedback('Please fill in all three fields.');
      return;
    }

    const newContact: CareContact = {
      id: `contact-${Date.now()}`,
      name: cleanName,
      relationship: cleanRelationship,
      phone: cleanPhone,
      initials: cleanName
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };

    setContacts((previous) => [...previous, newContact]);
    setName('');
    setRelationship('');
    setPhone('');
    setShowForm(false);
    setFeedback(`${cleanName} was added to this demo.`);
  }

  function handleRemoveContact(contactId: string) {
    setContacts((previous) =>
      previous.filter((contact) => contact.id !== contactId)
    );
    setFeedback('Contact removed from this demo.');
  }

  return (
    <div className="card care-circle-page">
      <div className="card-header">
        <div className="card-header-icon blue">
          <Users />
        </div>
        <div>
          <h2>My Care Circle</h2>
          <p className="care-subtitle">
            People who are part of your support network
          </p>
        </div>
      </div>

      <div className="example-data-label">
        <FlaskConical size={14} />
        Sample contacts and demo-only changes
      </div>

      {feedback && (
        <div className="care-circle-feedback" role="status">
          <CheckCircle2 size={17} />
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback('')}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="care-circle-heading-row">
        <div>
          <h3>Trusted contacts</h3>
          <p>{contacts.length} contacts shown</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowForm((previous) => !previous);
            setFeedback('');
          }}
        >
          {showForm ? <X size={17} /> : <Plus size={17} />}
          {showForm ? 'Cancel' : 'Add Care Contact'}
        </button>
      </div>

      {showForm && (
        <form className="care-contact-form" onSubmit={handleAddContact}>
          <h3>Add a care contact</h3>

          <label htmlFor="care-contact-name">Full name</label>
          <input
            id="care-contact-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Ananya Sharma"
            required
          />

          <label htmlFor="care-contact-relationship">Relationship</label>
          <input
            id="care-contact-relationship"
            value={relationship}
            onChange={(event) => setRelationship(event.target.value)}
            placeholder="e.g. Daughter, neighbour, caregiver"
            required
          />

          <label htmlFor="care-contact-phone">Phone number</label>
          <input
            id="care-contact-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter phone number"
            required
          />

          <button type="submit" className="btn btn-primary">
            <Plus size={17} />
            Save Contact
          </button>

          <p className="care-contact-note">
            Demo only: contacts are not saved permanently or sent to anyone.
          </p>
        </form>
      )}

      <div className="care-circle-contact-list">
        {contacts.map((contact) => (
          <div className="contact-card" key={contact.id}>
            <div className="contact-avatar" aria-hidden="true">
              {contact.initials}
            </div>

            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="contact-relationship">
                {contact.relationship}
              </div>
              <div className="care-contact-phone">{contact.phone}</div>
            </div>

            <div className="contact-action">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  setFeedback(
                    `Demo only: no call was placed to ${contact.name}.`
                  )
                }
                aria-label={`Show call demo message for ${contact.name}`}
              >
                <Phone size={16} />
                Call
              </button>

              <button
                type="button"
                className="care-contact-remove"
                onClick={() => handleRemoveContact(contact.id)}
                aria-label={`Remove ${contact.name}`}
              >
                <X size={16} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="care-circle-empty">
          <UserRound size={30} />
          <p>No contacts yet. Add someone to your care circle.</p>
        </div>
      )}
    </div>
  );
}