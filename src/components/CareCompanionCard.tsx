
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
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
  Plus,
  Pencil,
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

const STORAGE_KEY = 'sahaara-wellbeing-history-v2';
const TASK_STORAGE_KEY = 'sahaara-care-tasks-v1';




function getDayKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
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
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
const [showTaskForm, setShowTaskForm] = useState(false);
const [taskTitle, setTaskTitle] = useState('');
const [taskTime, setTaskTime] = useState('');
const [taskPeriod, setTaskPeriod] = useState('Morning');
const [taskDetail, setTaskDetail] = useState('');
const [tasksLoaded, setTasksLoaded] = useState(false);
const [mood, setMood] = useState<MoodLabel | ''>('');
const [history, setHistory] = useState<MoodEntry[]>([]);
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

        setHistory(validEntries);
      }
    } else {
      setHistory([]);
    }
  } catch {
    setHistory([]);
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
  
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TASK_STORAGE_KEY);

      if (stored) {
        const savedTasks: unknown = JSON.parse(stored);

        if (Array.isArray(savedTasks)) {
          const validTasks = savedTasks.filter(
            (task): task is CareTask =>
              task !== null &&
              typeof task === 'object' &&
              typeof task.id === 'number' &&
              typeof task.title === 'string' &&
              typeof task.time === 'string' &&
              typeof task.period === 'string' &&
              typeof task.detail === 'string' &&
              typeof task.done === 'boolean'
          );

          setTasks(validTasks);
        }
      }
    } catch {
      // Keep the default tasks if stored data cannot be read.
    }

    setTasksLoaded(true);
  }, []);

  useEffect(() => {
    if (!tasksLoaded) return;

    try {
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // The app remains usable if browser storage is unavailable.
    }
  }, [tasks, tasksLoaded]);


  const completed = tasks.filter((task) => task.done).length;
  const progress = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }
  function openNewTaskForm() {
  setEditingTaskId(null);
  setTaskTitle('');
  setTaskTime('');
  setTaskPeriod('Morning');
  setTaskDetail('');
  setShowTaskForm(true);
}



function saveTask(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const title = taskTitle.trim();
  if (!title) return;

  if (editingTaskId !== null) {
    setTasks((current) =>
      current.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title,
              time: taskTime.trim() || 'Any time',
              period: taskPeriod,
              detail: taskDetail.trim(),
            }
          : task
      )
    );
  } else {
    const newTask: CareTask = {
      id: Date.now(),
      title,
      time: taskTime.trim() || 'Any time',
      period: taskPeriod,
      detail: taskDetail.trim(),
      done: false,
    };

    setTasks((current) => [...current, newTask]);
  }

  setShowTaskForm(false);
  setEditingTaskId(null);
}

function deleteTask(id: number) {
  setTasks((current) => current.filter((task) => task.id !== id));
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
  <button
    type="button"
    onClick={openNewTaskForm}
  >
    <Plus size={16} /> Add activity
  </button>
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
            
<div className="care-companion-task-actions">
  <button
    type="button"
    onClick={() => {
  setEditingTaskId(task.id);
  setTaskTitle(task.title);
  setTaskTime('');
  setTaskPeriod(task.period);
  setTaskDetail(task.detail);
  setShowTaskForm(true);
}}
    aria-label={`Edit ${task.title}`}
  >
    <Pencil size={16} /> Edit
  </button>
  <button
    type="button"
    onClick={() => deleteTask(task.id)}
    aria-label={`Delete ${task.title}`}
  >
    Delete
  </button>
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
        {showTaskForm && (
  <form
    onSubmit={saveTask}
    style={{
      display: 'grid',
      gap: '12px',
      padding: '16px',
      margin: '16px 0',
      border: '1px solid #dce8e1',
      borderRadius: '12px',
    }}
  >
    <h3>{editingTaskId !== null ? 'Edit activity' : 'Add activity'}</h3>

    <label>
      Activity name *
      <input
        value={taskTitle}
        onChange={(event) => setTaskTitle(event.target.value)}
        placeholder="e.g. Take a morning walk"
        maxLength={100}
        required
      />
    </label>

    <label>
      Time (optional)
      <input
        type="time"
        value={taskTime}
        onChange={(event) => setTaskTime(event.target.value)}
      />
    </label>

    <label>
      Part of day
      <select
        value={taskPeriod}
        onChange={(event) => setTaskPeriod(event.target.value)}
      >
        <option>Morning</option>
        <option>Afternoon</option>
        <option>Evening</option>
        <option>Anytime</option>
      </select>
    </label>

    <label>
      Details (optional)
      <input
        value={taskDetail}
        onChange={(event) => setTaskDetail(event.target.value)}
        placeholder="Add a helpful note"
        maxLength={200}
      />
    </label>

    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <button type="submit">Save activity</button>
      <button
        type="button"
        onClick={() => setShowTaskForm(false)}
      >
        Cancel
      </button>
    </div>
  </form>
)}

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
<span>
  {lastSevenDays.reduce((total, day) => total + day.count, 0)} saved check-in
  {lastSevenDays.reduce((total, day) => total + day.count, 0) === 1 ? '' : 's'}
</span>
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