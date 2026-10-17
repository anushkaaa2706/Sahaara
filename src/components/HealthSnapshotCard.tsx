
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  HeartPulse,
  Droplet,
  Pencil,
  Save,
  X,
} from 'lucide-react';

type ReadingType = 'bp' | 'hr' | 'sugar';

interface HealthReading {
  id: string;
  type: ReadingType;
  value: string;
  date: string;
}

const STORAGE_KEY = 'sahaara-health-readings-v1';

const READING_INFO = [
  {
    id: 'bp' as const,
    label: 'Blood pressure',
    unit: 'mmHg',
    icon: HeartPulse,
    placeholder: '120/80',
  },
  {
    id: 'hr' as const,
    label: 'Heart rate',
    unit: 'bpm',
    icon: Activity,
    placeholder: '72',
  },
  {
    id: 'sugar' as const,
    label: 'Blood glucose',
    unit: 'mg/dL',
    icon: Droplet,
    placeholder: '95',
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return 'Recorded date unavailable';

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function HealthSnapshotCard() {
  const [history, setHistory] = useState<HealthReading[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({
    bp: '',
    hr: '',
    sugar: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item &&
              typeof item.id === 'string' &&
              ['bp', 'hr', 'sugar'].includes(item.type) &&
              typeof item.value === 'string' &&
              typeof item.date === 'string'
          )
        ) {
          setHistory(parsed);
        }
      }
    } catch {
      // Keep the snapshot empty if saved data cannot be read.
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // The card remains usable if browser storage is unavailable.
    }
  }, [history, loaded]);

  const latestReadings = READING_INFO.map((info) => ({
    ...info,
    reading: history
      .filter((item) => item.type === info.id)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0],
  }));

  function saveReadings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const entries: HealthReading[] = [];

    if (values.bp.trim()) {
      if (!/^\d{2,3}\s*\/\s*\d{2,3}$/.test(values.bp.trim())) {
        setError('Enter blood pressure like 120/80.');
        return;
      }

      entries.push({
        id: crypto.randomUUID(),
        type: 'bp',
        value: values.bp.trim(),
        date: new Date().toISOString(),
      });
    }

    for (const type of ['hr', 'sugar'] as const) {
      const raw = values[type].trim();

      if (!raw) continue;

      const number = Number(raw);

      if (!Number.isFinite(number) || number <= 0 || number > 10000) {
        setError('Enter a valid positive number for each reading.');
        return;
      }

      entries.push({
        id: crypto.randomUUID(),
        type,
        value: String(number),
        date: new Date().toISOString(),
      });
    }

    if (entries.length === 0) {
      setError('Enter at least one reading before saving.');
      return;
    }

    setHistory((previous) => [...entries, ...previous]);
    setValues({ bp: '', hr: '', sugar: '' });
    setEditing(false);
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon green">
          <Activity />
        </div>

        <div>
          <h2>Recent Health Snapshot</h2>
          <p className="health-card-subtitle">
            Your latest recorded readings
          </p>
        </div>
      </div>

      <div className="health-snapshot-list">
        {latestReadings.map((item) => {
          const Icon = item.icon;

          return (
            <div className="health-reading" key={item.id}>
              <div className="health-reading-left">
                <div className="health-reading-symbol">
                  <Icon size={18} />
                </div>

                <div>
                  <div className="health-reading-label">{item.label}</div>
                  <div className="health-reading-meta">
                    {item.reading
                      ? formatDate(item.reading.date)
                      : 'No reading recorded yet'}
                  </div>
                </div>
              </div>

              <div className="health-reading-right">
                <div className="health-reading-value">
                  {item.reading?.value ?? '—'}
                </div>
                <div className="health-reading-meta">{item.unit}</div>
              </div>
            </div>
          );
        })}
      </div>

      {!editing ? (
        <button
          type="button"
          className="view-link"
          onClick={() => setEditing(true)}
          style={{
            background: 'none',
            border: 0,
            cursor: 'pointer',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Pencil size={16} />
          Add / update readings
        </button>
      ) : (
        <form onSubmit={saveReadings} style={{ marginTop: 16 }}>
          <p className="health-card-subtitle">
            Enter the readings you measured. Leave other fields blank to
            keep their latest values unchanged.
          </p>

          {READING_INFO.map((item) => (
            <label
              key={item.id}
              style={{
                display: 'block',
                marginTop: 12,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {item.label} ({item.unit})
              <input
                type="text"
                inputMode={item.id === 'bp' ? 'text' : 'decimal'}
                placeholder={item.placeholder}
                value={values[item.id]}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [item.id]: event.target.value,
                  }))
                }
                style={{
                  display: 'block',
                  boxSizing: 'border-box',
                  width: '100%',
                  marginTop: 6,
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  font: 'inherit',
                }}
              />
            </label>
          ))}

          {error && (
            <p role="alert" style={{ color: '#b91c1c', fontSize: 13 }}>
              {error}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 16,
            }}
          >
            <button type="submit" className="view-link">
              <Save size={16} />
              Save readings
            </button>
            <button
              type="button"
              className="view-link"
              onClick={() => {
                setEditing(false);
                setError('');
                setValues({ bp: '', hr: '', sugar: '' });
              }}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </form>
      )}

      <Link to="/health" className="view-link" id="link-health-history">
        View health history
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
