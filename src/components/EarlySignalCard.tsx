
import { useEffect, useState } from 'react';
import {
  Activity,
  Heart,
  Footprints,
  CheckCircle2,
  MessageCircleHeart,
  HeartPulse,
  Droplets,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

type Mood = {
  id: string;
  mood: 'Good' | 'Okay' | 'Not great';
  date: string;
};

type HealthReading = {
  id: string;
  type: 'bp' | 'hr' | 'sugar';
  value: string;
  date: string;
};

type Metric = {
  label: string;
  latest: string;
  status: string;
  detail: string;
  alert: boolean;
};

const TASK_KEY = 'sahaara-care-tasks-v1';
const MOOD_KEY = 'sahaara-wellbeing-history-v2';
const STEPS_KEY = 'sahaara-daily-steps-v1';
const HEALTH_KEY = 'sahaara-health-readings-v1';

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function offsetDate(daysAgo: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return dateKey(date);
}

function numberValue(value: string) {
  if (!/^\s*\d+(\.\d+)?\s*$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function bpValue(value: string) {
  const match = value.trim().match(/^(\d{2,3})\s*\/\s*(\d{2,3})$/);
  return match ? { top: Number(match[1]), bottom: Number(match[2]) } : null;
}

function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function trendMetric(
  label: string,
  values: { date: string; value: number }[],
  latest: string,
  threshold: number,
): Metric {
  const recent = new Map<string, number[]>();
  const baseline = new Map<string, number[]>();

  values.forEach(({ date, value }) => {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return;
    const key = dateKey(parsedDate);

    if (key >= offsetDate(2) && key <= offsetDate(0)) {
      recent.set(key, [...(recent.get(key) || []), value]);
    } else if (key >= offsetDate(9) && key <= offsetDate(3)) {
      baseline.set(key, [...(baseline.get(key) || []), value]);
    }
  });

  const recentDaily = [...recent.values()].map(mean);
  const baselineDaily = [...baseline.values()].map(mean);

  if (recentDaily.length < 2 || baselineDaily.length < 3) {
    return {
      label,
      latest,
      status: 'Not enough data',
      detail: 'Record readings on at least 2 recent days and 3 earlier days to compare your personal trend.',
      alert: false,
    };
  }

  const baselineAverage = mean(baselineDaily);
  const changedDays = recentDaily.filter(
    (value) => Math.abs(value - baselineAverage) / Math.max(Math.abs(baselineAverage), 1) >= threshold,
  ).length;

  return changedDays >= 2
    ? {
        label,
        latest,
        status: 'Trend detected',
        detail: 'Readings have differed from your previous-week average on multiple days. Consider reviewing the trend with a healthcare professional.',
        alert: true,
      }
    : {
        label,
        latest,
        status: 'Stable trend',
        detail: 'Recent readings are broadly similar to your previous-week average.',
        alert: false,
      };
}

export function EarlySignalCard() {
  const [message, setMessage] = useState('Your personal health and care summary will appear here.');
  const [detail, setDetail] = useState('Record health readings and daily activity to build your personal trend.');
  const [mood, setMood] = useState('');
  const [saved, setSaved] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    function analyze() {
      try {
        const moods = JSON.parse(localStorage.getItem(MOOD_KEY) || '[]') as Mood[];
        const readings = JSON.parse(localStorage.getItem(HEALTH_KEY) || '[]') as HealthReading[];
        const steps = JSON.parse(localStorage.getItem(STEPS_KEY) || '{}') as Record<string, number>;
        const tasks = JSON.parse(localStorage.getItem(TASK_KEY) || '[]') as { id: number; done: boolean }[];

        const today = offsetDate(0);
        const todayMood = moods.find((entry) => entry.date === today);
        setMood(todayMood?.mood || '');

        const validReadings = Array.isArray(readings)
          ? readings.filter((r) => r && ['bp', 'hr', 'sugar'].includes(r.type) && typeof r.value === 'string' && typeof r.date === 'string')
          : [];

        const nextMetrics: Metric[] = [];

        for (const type of ['bp', 'hr', 'sugar'] as const) {
          const entries = validReadings.filter((r) => r.type === type);
          const latest = [...entries].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )[0];

          if (type === 'bp') {
            const parsed = entries.flatMap((r) => {
              const bp = bpValue(r.value);
              return bp ? [{ date: r.date, value: bp.top }] : [];
            });
            const latestBP = latest ? bpValue(latest.value) : null;
            const result = trendMetric(
              'Blood pressure',
              parsed,
              latest?.value || '—',
              0.15,
            );

            if (latestBP && (latestBP.top >= 180 || latestBP.bottom >= 120)) {
              result.status = 'Safety alert';
              result.detail = 'This is a very high blood pressure reading. Recheck promptly and seek urgent medical guidance. If there are symptoms such as chest pain, shortness of breath, weakness, confusion, or vision changes, seek emergency help.';
              result.alert = true;
            }
            nextMetrics.push(result);
          } else {
            const parsed = entries.flatMap((r) => {
              const value = numberValue(r.value);
              return value === null ? [] : [{ date: r.date, value }];
            });
            nextMetrics.push(
              trendMetric(
                type === 'hr' ? 'Heart rate' : 'Blood glucose',
                parsed,
                latest?.value || '—',
                type === 'hr' ? 0.2 : 0.25,
              ),
            );
          }
        }

        const stepValues = Object.entries(steps)
          .filter(([date, value]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(value) && value >= 0)
          .map(([date, value]) => ({ date, value }));

        const stepMetric = trendMetric(
          'Daily steps',
          stepValues,
          typeof steps[today] === 'number' ? steps[today].toLocaleString('en-IN') : '—',
          0.3,
        );
        if (stepMetric.status === 'Trend detected') {
          stepMetric.detail = 'Your recent activity differs from your previous-week average on multiple days.';
        }
        nextMetrics.push(stepMetric);
        setMetrics(nextMetrics);

        if (nextMetrics.some((metric) => metric.alert)) {
          setMessage('A health or activity trend needs your attention');
          setDetail('Review the individual summaries below. A trend is not a diagnosis.');
        } else if (todayMood === undefined) {
          setMessage('Your personal care overview');
          setDetail('Add a mood check-in and keep recording readings to build a clearer picture over time.');
        } else if (todayMood.mood === 'Not great' || todayMood.mood === 'Okay') {
          setMessage('A gentle check-in, just for you');
          setDetail('You noted how you feel today. Consider taking a pause or choosing one small, manageable care activity.');
        } else if (tasks.length > 0 && tasks.filter((task) => task.done).length < tasks.length / 2) {
          setMessage('Let’s make today manageable');
          setDetail('Several care activities are still unchecked. You could choose one small task to do next, or leave the rest for later.');
        } else {
          setMessage('You’re building your own care rhythm');
          setDetail('Your saved readings and activity help you reflect on your routine over time.');
        }
      } catch {
        setMessage('Your care summary is not available yet');
        setDetail('Check your saved health readings and try again.');
        setMetrics([]);
      }
    }

    analyze();
    window.addEventListener('focus', analyze);
    window.addEventListener('storage', analyze);
    return () => {
      window.removeEventListener('focus', analyze);
      window.removeEventListener('storage', analyze);
    };
  }, []);

  function saveCheckIn(value: string) {
    try {
      const history = JSON.parse(localStorage.getItem(MOOD_KEY) || '[]') as Mood[];
      const updated = [
        ...history.filter((entry) => entry.date !== offsetDate(0)),
        { id: `${offsetDate(0)}-early-signal`, mood: value as Mood['mood'], date: offsetDate(0) },
      ];
      localStorage.setItem(MOOD_KEY, JSON.stringify(updated));
      setMood(value);
      setSaved(true);
      setMessage('Thanks for checking in with yourself');
      setDetail('Your check-in is saved in this browser. This feature is not a diagnosis or emergency monitor.');
    } catch {
      setSaved(false);
      setDetail('Could not save this check-in in your browser.');
    }
  }

  return (
    <section style={{ padding: 24, borderRadius: 20, border: '1px solid #d7e9e2', background: 'linear-gradient(135deg, #f1faf6, #ffffff)', color: '#183c35' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ background: '#d9f1e6', borderRadius: 14, padding: 12, display: 'flex' }}>
          <Activity size={25} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>SAHAARA · EARLY SIGNAL</p>
          <h2 style={{ margin: '5px 0 0', fontSize: 23 }}>A little care, at the right time</h2>
        </div>
      </div>

      <div style={{ marginTop: 20, background: '#ffffff', border: '1px solid #e0eee8', borderRadius: 16, padding: 18 }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{message}</p>
        <p style={{ color: '#526a64', lineHeight: 1.6 }}>{detail}</p>

        <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
          {metrics.map((metric) => (
            <div key={metric.label} style={{ padding: 13, borderRadius: 12, border: `1px solid ${metric.alert ? '#e7c6a5' : '#e0eee8'}`, background: metric.alert ? '#fff8f0' : '#fbfdfc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <strong>{metric.label}</strong>
                <strong>{metric.latest}</strong>
              </div>
              <p style={{ margin: '7px 0 4px', fontWeight: 700 }}>{metric.status}</p>
              <p style={{ margin: 0, color: '#526a64', lineHeight: 1.5, fontSize: 14 }}>{metric.detail}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 20 }}>
          <MessageCircleHeart size={19} />
          <strong>How are you feeling today?</strong>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {[
            { label: 'Good', icon: '😊' },
            { label: 'Okay', icon: '😐' },
            { label: 'Not great', icon: '💚' },
          ].map((option) => (
            <button key={option.label} onClick={() => saveCheckIn(option.label)} style={{ cursor: 'pointer', borderRadius: 999, padding: '10px 15px', border: mood === option.label ? '2px solid #28765f' : '1px solid #cbded5', background: mood === option.label ? '#e0f4e9' : '#fff', color: '#183c35', fontWeight: 600 }}>
              {option.icon} {option.label}
            </button>
          ))}
        </div>
        {saved && <p style={{ color: '#28765f', fontWeight: 600 }}><CheckCircle2 size={16} style={{ verticalAlign: 'middle' }} /> Check-in saved</p>}
      </div>

      <p style={{ fontSize: 12, color: '#647a73', lineHeight: 1.5, marginBottom: 0 }}>
        <Heart size={13} style={{ verticalAlign: 'middle' }} />{' '}
        <Footprints size={13} style={{ verticalAlign: 'middle' }} />{' '}
        <HeartPulse size={13} style={{ verticalAlign: 'middle' }} />{' '}
        <Droplets size={13} style={{ verticalAlign: 'middle' }} />{' '}
        <TrendingUp size={13} style={{ verticalAlign: 'middle' }} />{' '}
        
      </p>
    </section>
  );
}
