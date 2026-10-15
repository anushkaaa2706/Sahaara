import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Heart,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Sun,
  TrendingUp,
  CalendarDays,
} from 'lucide-react';

type MoodLabel = 'Good' | 'Okay' | 'Not great';

interface CareTask {
  id: number;
  time: string;
  period: string;
  title: string;
  detail: string;
  done: boolean;
}

interface MoodEntry {
  id: string;
  mood: MoodLabel;
  date: string;
}

const initialTasks: CareTask[] = [
  {
    id: 1,
    time: '8:00 AM',
    period: 'Morning',
    title: 'Take morning medicines',
    detail: 'Follow your prescribed medicine schedule.',
    done: false,
  },
  {
    id: 2,
    time: '9:00 AM',
    period: 'Morning',
    title: 'Drink a glass of water',
    detail: 'A gentle reminder to stay hydrated.',
    done: false,
  },
  {
    id: 3,
    time: '1:00 PM',
    period: 'Afternoon',
    title: 'Have your afternoon meal',
    detail: 'Enjoy a balanced meal at your usual time.',
    done: false,
  },
  {
    id: 4,
    time: '6:00 PM',
    period: 'Evening',
    title: 'Check in with yourself',
    detail: 'Pause and notice how you are feeling.',
    done: false,
  },
];

const moods: {
  label: MoodLabel;
  icon: typeof Smile;
}[] = [
  { label: 'Good', icon: Smile },
  { label: 'Okay', icon: Meh },
  { label: 'Not great', icon: Frown },
];

const STORAGE_KEY = 'sahaara-wellbeing-history';

const SAMPLE_MOOD_HISTORY: MoodEntry[] = (() => {
  const samples: { daysAgo: number; mood: MoodLabel }[] = [
    { daysAgo: 6, mood: 'Good' },
    { daysAgo: 5, mood: 'Okay' },
    { daysAgo: 4, mood: 'Good' },
    { daysAgo: 3, mood: 'Not great' },
    { daysAgo: 2, mood: 'Okay' },
    { daysAgo: 1, mood: 'Good' },
  ];

  return samples.map((sample) => {
    const date = new Date();
    date.setDate(date.getDate() - sample.daysAgo);

    return {
      id: `sample-${getDayKey(date)}`,
      mood: sample.mood,
      date: getDayKey(date),
    };
  });
})();


function getDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatEntryDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  const today = getDayKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today) return 'Today';
  if (dateString === getDayKey(yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function CareCompanionCard() {
  const [tasks, setTasks] = useState<CareTask[]>(initialTasks);
  const [mood, setMood] = useState<MoodLabel | ''>('');
  const [history, setHistory] = useState<MoodEntry[]>(SAMPLE_MOOD_HISTORY);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const validEntries = parsed.filter(
            (entry): entry is MoodEntry =>
              entry !== null &&
              typeof entry === 'object' &&
              typeof entry.id === 'string' &&
              typeof entry.date === 'string' &&
              ['Good', 'Okay', 'Not great'].includes(entry.mood)
          );

       setHistory(() => {
  const combined = [...SAMPLE_MOOD_HISTORY, ...validEntries];

  return combined.filter(
    (entry, index, entries) =>
      entries.findIndex(
        (item) => item.id === entry.id
      ) === index
  );
});
        }
      }
    } catch {
      // If saved demo data cannot be read, start with an empty history.
    }

    setHistoryLoaded(true);
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // The app remains usable if browser storage is unavailable.
    }
  }, [history, historyLoaded]);

  const completed = tasks.filter((task) => task.done).length;
  const progress = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function saveMood() {
    if (!mood) return;

    const entry: MoodEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mood,
      date: getDayKey(new Date()),
    };

    setHistory((current) => [entry, ...current]);
    setSavedMessage(
      `Your check-in has been saved: feeling ${mood.toLowerCase()}.`
    );
    setMood('');
  }

  const todayKey = getDayKey(new Date());
  const todayEntries = history.filter((entry) => entry.date === todayKey);

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    const key = getDayKey(date);
    const entries = history.filter((entry) => entry.date === key);

    return {
      key,
      label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      count: entries.length,
      latestMood: entries[0]?.mood,
    };
  });
  const checkInStreak = (() => {
    let streak = 0;
    const today = getDayKey(new Date());

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = getDayKey(date);

      const hasCheckIn = history.some(
        (entry) => entry.date === key
      );

      if (hasCheckIn) {
        streak++;
      } else if (key !== today || i === 0) {
        break;
      }
    }

    return streak;
  })();

  const goodCount = history.filter((entry) => entry.mood === 'Good').length;
  const okayCount = history.filter((entry) => entry.mood === 'Okay').length;
  const notGreatCount = history.filter(
    (entry) => entry.mood === 'Not great'
  ).length;

  return (
    <section className="care-companion">
      <div className="care-companion-header">
        <div className="care-companion-heading">
          <span className="care-companion-icon">
            <Heart size={24} />
          </span>
          <div>
            <p className="care-companion-eyebrow">YOUR DAILY COMPANION</p>
            <h2>My Day, My Care</h2>
            <p>A little care goes a long way.</p>
          </div>
        </div>
        <span className="care-companion-sparkle">
          <Sparkles size={18} />
        </span>
      </div>

      <div className="care-companion-progress">
        <div className="care-companion-progress-top">
          <span>Today's care progress</span>
          <strong>{completed} of {tasks.length} completed</strong>
        </div>
        <div
          className="care-companion-progress-track"
          role="progressbar"
          aria-label="Today's care tasks completed"
          aria-valuemin={0}
          aria-valuemax={tasks.length}
          aria-valuenow={completed}
        >
          <div
            className="care-companion-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p>
          {progress === 100
            ? 'Wonderful! You have completed every task.'
            : 'One step at a time. You are doing great.'}
        </p>
      </div>

      <div className="care-companion-section-title">
        <Sun size={19} />
        <h3>Your care plan</h3>
      </div>

      <div className="care-companion-timeline">
        {tasks.map((task) => (
          <div
            className={`care-companion-task ${task.done ? 'is-complete' : ''}`}
            key={task.id}
          >
            <div className="care-companion-task-time">
              <Clock size={15} />
              <span>{task.time}</span>
            </div>

            <div className="care-companion-task-content">
              <strong>{task.title}</strong>
              <p>{task.detail}</p>
              <span className="care-companion-period">{task.period}</span>
            </div>

            <button
              type="button"
              className="care-companion-task-button"
              onClick={() => toggleTask(task.id)}
              aria-pressed={task.done}
            >
              {task.done ? (
                <CheckCircle2 size={22} />
              ) : (
                <Circle size={22} />
              )}
              <span>{task.done ? 'Done' : 'Mark done'}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="care-companion-mood">
        <div className="care-companion-section-title">
          <Heart size={19} />
          <h3>How are you feeling today?</h3>
        </div>
        <p>Your feelings matter. Choose the option that feels right.</p>

        {mood && (
          <p className="mood-encouragement" aria-live="polite">
            {mood === 'Good'
              ? 'That’s lovely! Take a moment to enjoy what feels good today. 💚'
              : mood === 'Okay'
                ? 'One step at a time. You deserve care on ordinary days, too. 🌿'
                : 'It’s okay not to feel your best. Be gentle with yourself today. 💜'}
          </p>
        )}

        <div className="care-companion-moods">
          {moods.map(({ label, icon: MoodIcon }) => (
            <button
              type="button"
              key={label}
              className={`care-companion-mood-button ${
                mood === label ? 'is-selected' : ''
              }`}
              onClick={() => {
                setMood(label);
                setSavedMessage('');
              }}
              aria-pressed={mood === label}
            >
              <MoodIcon size={23} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="care-companion-save-button"
          disabled={!mood}
          onClick={saveMood}
        >
          Save my check-in
        </button>

        {savedMessage && (
          <p className="care-companion-feedback" role="status">
            {savedMessage}
          </p>
        )}
      </div>

      <section className="wellbeing-history">
        <div className="wellbeing-history-header">
          <div>
            <p className="care-companion-eyebrow">A MOMENT FOR YOU</p>
            <h3>
              <TrendingUp size={21} />
              My Wellbeing History
            </h3>
            <p>Your saved check-ins, all in one place.</p>
            
  <p className="check-in-streak">
    🔥 {checkInStreak}-day check-in streak
  </p>

          </div>
          <span className="wellbeing-history-icon">
            <CalendarDays size={22} />
          </span>
        </div>

        <div className="wellbeing-week">
          <strong>Last 7 days</strong>
          <span>{history.length} saved check-in{history.length === 1 ? '' : 's'}</span>
        </div>

        <div className="wellbeing-week-chart">
          {lastSevenDays.map((day) => (
            <div className="wellbeing-day" key={day.key}>
              <div className="wellbeing-bar-area">
                <div
                  className={`wellbeing-bar ${
                    day.count ? 'has-entry' : ''
                  }`}
                  style={{
                    height: day.count
                      ? `${Math.min(100, 35 + day.count * 20)}%`
                      : '8%',
                  }}
                  title={`${day.count} check-in${day.count === 1 ? '' : 's'}`}
                />
              </div>
              <span className="wellbeing-day-label">{day.label}</span>
              <span className="wellbeing-day-mood">
                {day.latestMood === 'Good'
                  ? '😊'
                  : day.latestMood === 'Okay'
                    ? '😐'
                    : day.latestMood === 'Not great'
                      ? '😟'
                      : '·'}
              </span>
            </div>
          ))}
        </div>

        <div className="wellbeing-mood-summary">
          <div>
            <span className="wellbeing-mood-dot mood-good" />
            <span>Good</span>
            <strong>{goodCount}</strong>
          </div>
          <div>
            <span className="wellbeing-mood-dot mood-okay" />
            <span>Okay</span>
            <strong>{okayCount}</strong>
          </div>
          <div>
            <span className="wellbeing-mood-dot mood-low" />
            <span>Not great</span>
            <strong>{notGreatCount}</strong>
          </div>
        </div>

        <div className="wellbeing-recent">
          <h4>Recent check-ins</h4>

          {history.length === 0 ? (
            <p className="wellbeing-empty">
              Your history will appear here after you save your first check-in.
            </p>
          ) : (
            history.slice(0, 5).map((entry) => {
              const MoodIcon =
                moods.find((item) => item.label === entry.mood)?.icon ?? Meh;

              return (
                <div className="wellbeing-entry" key={entry.id}>
                  <span className="wellbeing-entry-icon">
                    <MoodIcon size={21} />
                  </span>
                  <div className="wellbeing-entry-info">
                    <strong>Feeling {entry.mood.toLowerCase()}</strong>
                    <span>{formatEntryDate(entry.date)}</span>
                  </div>
                  <span className="wellbeing-entry-status">Saved</span>
                </div>
              );
            })
          )}
        </div>

      
      </section>

      
    </section>
  );
}