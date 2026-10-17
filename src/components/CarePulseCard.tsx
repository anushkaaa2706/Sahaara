
import { useEffect, useState } from 'react';
import {
  HeartPulse,
  CheckCircle2,
  Footprints,
  Heart,
  Share2,
} from 'lucide-react';

type CareTask = {
  id: number;
  title: string;
  done: boolean;
};

type MoodEntry = {
  id: string;
  mood: 'Good' | 'Okay' | 'Not great';
  date: string;
};

const TASK_KEY = 'sahaara-care-tasks-v1';
const MOOD_KEY = 'sahaara-wellbeing-history-v2';
const STEPS_KEY = 'sahaara-daily-steps-v1';

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CarePulseCard() {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [mood, setMood] = useState('');
  const [steps, setSteps] = useState(0);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    function loadData() {
      try {
        const savedTasks = JSON.parse(
          localStorage.getItem(TASK_KEY) || '[]'
        ) as CareTask[];

        const savedMoods = JSON.parse(
          localStorage.getItem(MOOD_KEY) || '[]'
        ) as MoodEntry[];

        const savedSteps = JSON.parse(
          localStorage.getItem(STEPS_KEY) || '{}'
        ) as Record<string, number>;

        setTasks(Array.isArray(savedTasks) ? savedTasks : []);

        const todayMood = Array.isArray(savedMoods)
          ? savedMoods.find((entry) => entry.date === getTodayKey())
          : undefined;

        setMood(todayMood?.mood || '');
        setSteps(savedSteps[getTodayKey()] || 0);
      } catch {
        setTasks([]);
        setMood('');
        setSteps(0);
      }
    }

    loadData();

    window.addEventListener('focus', loadData);
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const completed = tasks.filter((task) => task.done).length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const shareSummary = async () => {
    const summary = [
      'My Sahaara Care Pulse',
      `Care activities completed: ${completed} of ${tasks.length}`,
      `Mood check-in: ${mood || 'Not recorded today'}`,
      `Steps recorded today: ${steps.toLocaleString('en-IN')}`,
      '',
      'Shared by me from Sahaara.',
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Sahaara Care Pulse',
          text: summary,
        });
        setShareMessage('Your sharing options were opened.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        setShareMessage('Summary copied. You can paste it into a message.');
      } else {
        setShareMessage('Sharing is not supported in this browser.');
      }
    } catch {
      setShareMessage('Sharing cancelled or unavailable.');
    }
  };

  return (
    <section
      style={{
        padding: '24px',
        margin: '20px 0',
        border: '1px solid #dce8e1',
        borderRadius: '18px',
        background: '#f7fbf8',
        color: '#234638',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <HeartPulse size={28} />
        <div>
          <p style={{ margin: 0, fontSize: '12px', letterSpacing: '1px' }}>
            YOUR DAILY WELLBEING
          </p>
          <h2 style={{ margin: '4px 0' }}>Your Care Pulse</h2>
          <p style={{ margin: 0 }}>Your daily care, together in one place.</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginTop: '20px',
        }}
      >
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px' }}>
          <CheckCircle2 size={22} />
          <h3>Care routine</h3>
          <strong>{completed} of {tasks.length} completed</strong>
          <div
            style={{
              height: '7px',
              background: '#e4eee8',
              borderRadius: '8px',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                height: '7px',
                width: `${progress}%`,
                background: '#41866b',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '16px' }}>
          <Heart size={22} />
          <h3>Today's mood</h3>
          <strong>{mood || 'Not recorded yet'}</strong>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '16px' }}>
          <Footprints size={22} />
          <h3>Steps today</h3>
          <strong>{steps.toLocaleString('en-IN')}</strong>
          <p style={{ fontSize: '12px', marginBottom: 0 }}>
            Manually recorded
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={shareSummary}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '18px',
          padding: '12px 16px',
          border: 0,
          borderRadius: '10px',
          background: '#41866b',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        <Share2 size={18} />
        Share my Care Pulse
      </button>

      {shareMessage && (
        <p role="status" aria-live="polite">{shareMessage}</p>
      )}

      <p style={{ fontSize: '12px', marginTop: '14px' }}>
        This summary uses information saved in this browser. You choose
        whether to share it. It does not provide live remote caregiver access.
      </p>
    </section>
  );
}
