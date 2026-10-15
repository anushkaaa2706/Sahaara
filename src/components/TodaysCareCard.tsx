import { useState } from 'react';
import {
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  RotateCcw,
  Heart,
  GlassWater,
  Salad,
} from 'lucide-react';
import {
  DEMO_MEDICINE,
  DEMO_APPOINTMENT,
  DEMO_NEXT_CHECKIN,
} from '../data/demoData';

export function TodaysCareCard() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const tasks = [
    {
      id: 'medicine',
      title: 'Take prescribed medicine',
      detail: `${DEMO_MEDICINE.name} · ${DEMO_MEDICINE.dosage}`,
      icon: Pill,
      color: 'blue',
    },
    {
      id: 'water',
      title: 'Drink water',
      detail: 'Your daily hydration reminder',
      icon: GlassWater,
      color: 'amber',
    },
    {
      id: 'meal',
      title: 'Have a balanced meal',
      detail: 'Your personal wellness goal',
      icon: Salad,
      color: 'purple',
    },
  ];

  const completedCount = completedTasks.length;
  const progress = Math.round(
    (completedCount / tasks.length) * 100
  );

  function toggleTask(taskId: string) {
    setCompletedTasks((previous) =>
      previous.includes(taskId)
        ? previous.filter((id) => id !== taskId)
        : [...previous, taskId]
    );
  }

  function resetTasks() {
    setCompletedTasks([]);
  }

  return (
    <div className="card todays-care-card">
      <div className="card-header">
        <div className="card-header-icon amber">
          <Clock />
        </div>
        <div>
          <h2>Today's Care</h2>
          <p className="care-subtitle">
            Small steps, taken one at a time
          </p>
        </div>
      </div>

      <div className="care-progress-panel">
        <div className="care-progress-top">
          <div className="care-progress-icon">
            <Heart size={17} />
          </div>

          <div className="care-progress-description">
            <div className="care-progress-title">
              Your care today
            </div>
            <div className="care-progress-detail">
              {completedCount === tasks.length
                ? 'All your daily goals are checked off!'
                : `${completedCount} of ${tasks.length} tasks completed`}
            </div>
          </div>

          <span className="care-progress-count">{progress}%</span>
        </div>

        <div
          className="care-progress-track"
          role="progressbar"
          aria-label="Daily care checklist progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="care-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="daily-task-list">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isComplete = completedTasks.includes(task.id);

          return (
            <div
              className={`daily-task${isComplete ? ' daily-task-complete' : ''}`}
              key={task.id}
            >
              <div className={`daily-task-icon ${task.color}`}>
                <Icon size={20} />
              </div>

              <div className="daily-task-content">
                <div className="daily-task-title">
                  {task.title}
                </div>
                <div className="daily-task-detail">
                  {task.detail}
                </div>
                {task.id === 'medicine' && (
                  <div className="daily-task-detail">
                    Sample reminder · Follow your prescribed instructions
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`daily-task-toggle${isComplete ? ' checked' : ''}`}
                onClick={() => toggleTask(task.id)}
                aria-pressed={isComplete}
                aria-label={`${isComplete ? 'Unmark' : 'Mark'} ${task.title} ${isComplete ? 'incomplete' : 'complete'}`}
              >
                {isComplete ? (
                  <CheckCircle2 size={25} />
                ) : (
                  <span className="daily-task-empty-circle" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {completedCount > 0 && (
        <div className="care-action-row care-reset-row">
          <span className="care-progress-detail">
            {completedCount === tasks.length
              ? 'Wonderful work on your checklist!'
              : 'Every small step counts.'}
          </span>

          <button
            type="button"
            className="care-undo-btn"
            onClick={resetTasks}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      )}

      <div className="care-supporting-items">
        <div className="care-item">
          <div
            className="care-icon"
            style={{
              background: 'var(--color-success-light)',
              color: 'var(--color-success)',
            }}
          >
            <Calendar />
          </div>
          <div className="care-item-content">
            <div className="care-item-title">
              {DEMO_APPOINTMENT.title}
            </div>
            <div className="care-item-detail">
              {DEMO_APPOINTMENT.date} at {DEMO_APPOINTMENT.time} — with{' '}
              {DEMO_APPOINTMENT.with}
            </div>
          </div>
        </div>

        <div className="care-item">
          <div
            className="care-icon"
            style={{
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
            }}
          >
            <Clock />
          </div>
          <div className="care-item-content">
            <div className="care-item-title">Next check-in</div>
            <div className="care-item-detail">
              {DEMO_NEXT_CHECKIN}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}