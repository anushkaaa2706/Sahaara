
import { useEffect, useState } from 'react';
import {
  Users,
   Phone,
  MessageCircle,
  Plus,
  X,
  UserRound,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Eye,
  EyeOff,
  Activity,
  Footprints,
  Droplets,
  Clock,
} from 'lucide-react';

type CareContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  initials: string;
  canViewHealth: boolean;
};

type HealthReading = {
  id: string;
  type: 'bp' | 'hr' | 'sugar';
  value: string;
  date: string;
};

const CONTACTS_KEY = 'sahaara-care-circle-v1';
const READINGS_KEY = 'sahaara-health-readings-v1';
const STEPS_KEY = 'sahaara-daily-steps-v1';
const ROLE_KEY = 'sahaara-care-circle-demo-role-v1';

const DEFAULT_CONTACTS: CareContact[] = [
  {
    id: 'doctor-ananya',
    name: 'Dr. Ananya Sharma',
    relationship: 'Primary Care Doctor',
    phone: '',
    initials: 'AS',
    canViewHealth: false,
  },
  {
    id: 'daughter-priya',
    name: 'Priya Sharma',
    relationship: 'Daughter',
    phone: '',
    initials: 'PS',
    canViewHealth: false,
  },
  {
    id: 'son-in-law-rahul',
    name: 'Rahul Sharma',
    relationship: 'Son-in-law',
    phone: '',
    initials: 'RS',
    canViewHealth: false,
  },
];

function loadContacts(): CareContact[] {
  try {
    const saved = localStorage.getItem(CONTACTS_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }

    // Migrate contacts from the previous demo version.
    const oldContacts = localStorage.getItem('sahaara-care-circle-v1');
    if (oldContacts) {
      const parsed = JSON.parse(oldContacts);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Use the default contacts if stored data is invalid.
  }

  return DEFAULT_CONTACTS;
}

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!value) return 'Date not recorded';

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: /^\d{4}-\d{2}-\d{2}$/.test(value) ? undefined : 'short',
  });
}

export function CareCircleCard() {
  const [contacts, setContacts] = useState<CareContact[]>(loadContacts);
  const [role, setRole] = useState<'adult' | 'contact'>(() => {
    return localStorage.getItem(ROLE_KEY) === 'contact' ? 'contact' : 'adult';
  });
  const [selectedContactId, setSelectedContactId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState('');
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [steps, setSteps] = useState<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  useEffect(() => {
    function loadHealthData() {
      try {
        const savedReadings = JSON.parse(
          localStorage.getItem(READINGS_KEY) || '[]'
        );
        setReadings(Array.isArray(savedReadings) ? savedReadings : []);
      } catch {
        setReadings([]);
      }

      try {
        const savedSteps = JSON.parse(
          localStorage.getItem(STEPS_KEY) || '{}'
        );
        setSteps(
          savedSteps && typeof savedSteps === 'object' ? savedSteps : {}
        );
      } catch {
        setSteps({});
      }
    }

    loadHealthData();
    window.addEventListener('focus', loadHealthData);
    window.addEventListener('storage', loadHealthData);

    return () => {
      window.removeEventListener('focus', loadHealthData);
      window.removeEventListener('storage', loadHealthData);
    };
  }, []);

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
      canViewHealth: false,
    };

    setContacts((previous) => [...previous, newContact]);
    setName('');
    setRelationship('');
    setPhone('');
    setShowForm(false);
    setFeedback(`${cleanName} was added to your care circle.`);
  }

  function toggleAccess(contactId: string, allowed: boolean) {
    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === contactId
          ? { ...contact, canViewHealth: allowed }
          : contact
      )
    );

    const contact = contacts.find((item) => item.id === contactId);
    setFeedback(
      allowed
        ? `Health-view access granted to ${contact?.name ?? 'contact'}.`
        : `Health-view access revoked for ${contact?.name ?? 'contact'}.`
    );
  }

  function handleRemoveContact(contactId: string) {
    const contact = contacts.find((item) => item.id === contactId);
    setContacts((previous) =>
      previous.filter((item) => item.id !== contactId)
    );

    if (selectedContactId === contactId) setSelectedContactId('');
    setFeedback(`${contact?.name ?? 'Contact'} removed.`);
  }

  const selectedContact = contacts.find(
    (contact) => contact.id === selectedContactId
  );
  const canView = selectedContact?.canViewHealth === true;

  const latest = (type: HealthReading['type']) =>
    readings
      .filter((reading) => reading.type === type)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

  const bp = latest('bp');
  const hr = latest('hr');
  const sugar = latest('sugar');
  const todaySteps = steps[todayKey()];

  if (role === 'contact') {
    return (
      <div className="card care-circle-page">
        <div className="card-header">
          <div className="card-header-icon blue">
            <HeartPulse />
          </div>
          <div>
            <h2>Trusted Contact View</h2>
            <p className="care-subtitle">
              View health information shared with you
            </p>
          </div>
        </div>

        <div className="care-circle-heading-row">
          <div>
            
            <p>Select the trusted contact you want to view as.</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setRole('adult')}
          >
            <UserRound size={16} />
            Older Adult View
          </button>
        </div>

        <label htmlFor="trusted-contact-select">Trusted contact</label>
        <select
          id="trusted-contact-select"
          value={selectedContactId}
          onChange={(event) => setSelectedContactId(event.target.value)}
        >
          <option value="">Choose a contact</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name} — {contact.relationship}
            </option>
          ))}
        </select>

        {!selectedContactId ? (
          <div className="care-circle-empty">
            <UserRound size={30} />
            <p>Choose a contact to see their access status.</p>
          </div>
        ) : !canView ? (
          <div className="care-circle-empty">
            <EyeOff size={30} />
            <h3>Health access not granted</h3>
            <p>
              {selectedContact?.name} cannot view these health readings.
              Switch to Older Adult View to grant access.
            </p>
          </div>
        ) : (
          <div className="shared-health-panel">
            <div className="care-circle-feedback" role="status">
              <ShieldCheck size={18} />
              <span>Health information has been shared with this contact.</span>
            </div>

            <h3>Latest health readings</h3>
            <p className="care-subtitle">
              Saved readings from the older adult's browser
            </p>

            <div className="health-share-list">
              <div className="health-share-row">
                <HeartPulse size={21} />
                <div>
                  <strong>Blood pressure</strong>
                  <p>{bp ? bp.value : 'No reading saved'}</p>
                  <small>{bp ? formatDate(bp.date) : 'Record a reading first'}</small>
                </div>
              </div>

              <div className="health-share-row">
                <Activity size={21} />
                <div>
                  <strong>Heart rate</strong>
                  <p>{hr ? `${hr.value} bpm` : 'No reading saved'}</p>
                  <small>{hr ? formatDate(hr.date) : 'Record a reading first'}</small>
                </div>
              </div>

              <div className="health-share-row">
                <Droplets size={21} />
                <div>
                  <strong>Blood glucose</strong>
                  <p>{sugar ? sugar.value : 'No reading saved'}</p>
                  <small>{sugar ? formatDate(sugar.date) : 'Record a reading first'}</small>
                </div>
              </div>

              <div className="health-share-row">
                <Footprints size={21} />
                <div>
                  <strong>Daily steps</strong>
                  <p>
                    {typeof todaySteps === 'number'
                      ? todaySteps.toLocaleString()
                      : 'No steps recorded today'}
                  </p>
                  <small>Today's saved activity</small>
                </div>
              </div>
            </div>

            <p className="care-contact-note">
              Demo only: this view uses data stored in this browser. It is not
              a secure remote-sharing service or a medical monitoring system.
            </p>
          </div>
        )}
      </div>
    );
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
          <p>{contacts.length} contacts saved</p>
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
              <div className="care-contact-phone">
                {contact.phone || 'Phone number not provided'}
              </div>

              <label className="care-access-toggle">
                <input
                  type="checkbox"
                  checked={contact.canViewHealth}
                  onChange={(event) =>
                    toggleAccess(contact.id, event.target.checked)
                  }
                />
                <span>
                  {contact.canViewHealth
                    ? 'Can view health'
                    : 'Health access off'}
                </span>
              </label>
            </div>

            <div className="contact-action">
              {contact.phone ? (
                <a
                  className="btn btn-outline btn-sm"
                  href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                  aria-label={`Call ${contact.name}`}
                >
                  <Phone size={16} />
                  Call
                </a>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    setFeedback(`Add a phone number for ${contact.name} to call them.`)
                  }
                >
                  <Phone size={16} />
                  Call
                </button>
              )}
              {contact.phone ? (
  <a
    className="btn btn-outline btn-sm"
    href={`sms:${contact.phone.replace(/[^\d+]/g, '')}?body=${encodeURIComponent(
      "I'm feeling unwell and need help. Please contact me as soon as possible."
    )}`}
    aria-label={`Message ${contact.name}`}
  >
    <MessageCircle size={16} />
    Message
  </a>
) : (
  <button
    type="button"
    className="btn btn-outline btn-sm"
    onClick={() =>
      setFeedback(`Add a phone number for ${contact.name} to message them.`)
    }
  >
    <MessageCircle size={16} />
    Message
  </button>
)}

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

      <div className="care-circle-heading-row">
        <div>
          
          <p>Switch roles to demonstrate health access.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setSelectedContactId('');
            setRole('contact');
            setFeedback('');
          }}
        >
          <Eye size={17} />
          View as Trusted Contact
        </button>
      </div>

      
    </div>
  );
}
