
import { useEffect, useState } from 'react';
import {
  SmilePlus,
  PhoneCall,
  Frown,
  CheckCircle2,
  Heart,
} from 'lucide-react';

type CheckInStatus = 'okay' | 'call' | 'unwell';

interface CheckInRecord {
  status: CheckInStatus;
  updatedAt: string;
}

type CheckInHistory = Record<string, CheckInRecord>;

const STORAGE_KEY = 'sahaara.dailyCheckIns.v1';

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function readHistory(): CheckInHistory {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as CheckInHistory : {};
  } catch {
    return {};
  }
}

const OPTIONS = [
  {
    value: 'okay' as const,
    label: "I'm okay",
    confirmation: 'Your check-in has been saved on this device.',
    icon: SmilePlus,
  },
  {
    value: 'call' as const,
    label: "I'd like a call",
    confirmation:
      'Your request has been saved on this device. No call has been placed.',
    icon: PhoneCall,
  },
  {
    value: 'unwell' as const,
    label: 'I feel unwell',
    confirmation:
      'Your response has been saved on this device. No care contact has been notified.',
    icon: Frown,
  },
];

export function DailyCheckInCard() {
  const [history, setHistory] = useState<CheckInHistory>({});
  const [loaded, setLoaded] = useState(false);

  const today = getTodayKey();
  const selected = history[today]?.status ?? null;

  useEffect(() => {
    setHistory(readHistory());
    setLoaded(true);
  }, []);

  function handleCheckIn(status: CheckInStatus) {
    const currentHistory = readHistory();

    const updatedHistory: CheckInHistory = {
      ...currentHistory,
      [getTodayKey()]: {
        status,
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch {
      window.alert(
        'Your check-in could not be saved. Please check your browser storage.'
      );
    }
  }

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
            onClick={() => handleCheckIn(value)}
            aria-pressed={selected === value}
            disabled={!loaded}
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

      {selected && history[today] && (
        <p className="checkin-subtitle">
          Last updated today at{' '}
          {new Date(history[today].updatedAt).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
