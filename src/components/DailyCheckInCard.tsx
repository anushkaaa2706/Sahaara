import { useState } from 'react';
import {
  SmilePlus,
  PhoneCall,
  Frown,
  CheckCircle2,
} from 'lucide-react';

type CheckInStatus = 'okay' | 'call' | 'unwell' | null;

const OPTIONS = [
  {
    value: 'okay' as const,
    label: "I'm okay",
    icon: SmilePlus,
    confirmation: "Great! We've noted that you're feeling well today.",
  },
  {
    value: 'call' as const,
    label: "I'd like a call",
    icon: PhoneCall,
    confirmation:
      'Your care contact will be asked to call you soon. (Demo — no real call placed.)',
  },
  {
    value: 'unwell' as const,
    label: 'I feel unwell',
    icon: Frown,
    confirmation:
      "We've let your care contact know. They will check in on you shortly. (Demo only.)",
  },
];

/**
 * Daily check-in card with three large, easy-to-tap choices.
 * Shows a confirmation message after selection.
 */
export function DailyCheckInCard() {
  const [selected, setSelected] = useState<CheckInStatus>(null);

  const selectedOption = OPTIONS.find((o) => o.value === selected);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon teal">
          <SmilePlus />
        </div>
        <h2>Daily Check-In</h2>
      </div>

      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
        How are you feeling today?
      </p>

      <div className="checkin-options" role="radiogroup" aria-label="Daily check-in">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            className={`checkin-btn${selected === value ? ' selected' : ''}`}
            onClick={() => setSelected(value)}
            role="radio"
            aria-checked={selected === value}
            id={`checkin-${value}`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      {selectedOption && (
        <div className="checkin-confirmation" role="status" aria-live="polite">
          <CheckCircle2 />
          {selectedOption.confirmation}
        </div>
      )}
    </div>
  );
}
