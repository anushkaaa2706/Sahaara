
import { useState } from 'react';
import {
  SmilePlus,
  PhoneCall,
  Frown,
  CheckCircle2,
  Heart,
} from 'lucide-react';

type CheckInStatus = 'okay' | 'call' | 'unwell' | null;

const OPTIONS = [
  {
    value: 'okay' as const,
    label: "I'm okay",
    icon: SmilePlus,
    confirmation:
      "Thank you for checking in! Your response is recorded for this demo.",
  },
  {
    value: 'call' as const,
    label: "I'd like a call",
    icon: PhoneCall,
    confirmation:
      'Your request is shown in this demo only. No call has been placed.',
  },
  {
    value: 'unwell' as const,
    label: 'I feel unwell',
    icon: Frown,
    confirmation:
      'Your response is shown in this demo only. No care contact has been notified.',
  },
];

export function DailyCheckInCard() {
  const [selected, setSelected] = useState<CheckInStatus>(null);

  const selectedOption = OPTIONS.find(
    (option) => option.value === selected
  );

  return (
    <div className="card daily-checkin-card">
      <div className="card-header">
        <div className="card-header-icon teal">
          <Heart />
        </div>
        <div>
          <h2>Daily Check-In</h2>
          <p className="checkin-subtitle">
            A little check-in goes a long way
          </p>
        </div>
      </div>

      <p className="checkin-question">
        How are you feeling today?
      </p>

      <div
        className="checkin-options"
        role="group"
        aria-label="Choose how you are feeling today"
      >
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            className={`checkin-btn${selected === value ? ' selected' : ''}`}
            onClick={() => setSelected(value)}
            aria-pressed={selected === value}
            id={`checkin-${value}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {selectedOption && (
        <div
          className="checkin-confirmation"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={20} />
          <span>{selectedOption.confirmation}</span>
        </div>
      )}

      
    </div>
  );
}
