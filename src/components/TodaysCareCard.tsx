import { useState } from 'react';
import {
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  DEMO_MEDICINE,
  DEMO_APPOINTMENT,
  DEMO_NEXT_CHECKIN,
} from '../data/demoData';

/**
 * Today's Care card — medicine reminder with "I've taken it" button,
 * next appointment, and next check-in time.
 */
export function TodaysCareCard() {
  const [medicineTaken, setMedicineTaken] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon amber">
          <Clock />
        </div>
        <h2>Today's Care</h2>
      </div>

      {/* Medicine reminder */}
      <div className="care-item">
        <div className="care-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
          <Pill />
        </div>
        <div className="care-item-content">
          <div className="care-item-title">
            {DEMO_MEDICINE.name} — {DEMO_MEDICINE.dosage}
          </div>
          <div className="care-item-detail">
            Scheduled for {DEMO_MEDICINE.time}
          </div>
          <div className="care-item-action">
            {medicineTaken ? (
              <span className="taken-badge" role="status" aria-live="polite">
                <CheckCircle2 size={16} />
                Taken — well done!
              </span>
            ) : (
              <button
                className="btn btn-success btn-sm"
                onClick={() => setMedicineTaken(true)}
                id="btn-medicine-taken"
              >
                <CheckCircle2 size={16} />
                I've taken it
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Next appointment */}
      <div className="care-item">
        <div className="care-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
          <Calendar />
        </div>
        <div className="care-item-content">
          <div className="care-item-title">{DEMO_APPOINTMENT.title}</div>
          <div className="care-item-detail">
            {DEMO_APPOINTMENT.date} at {DEMO_APPOINTMENT.time} — with{' '}
            {DEMO_APPOINTMENT.with}
          </div>
        </div>
      </div>

      {/* Next check-in */}
      <div className="care-item">
        <div className="care-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          <Clock />
        </div>
        <div className="care-item-content">
          <div className="care-item-title">Next check-in</div>
          <div className="care-item-detail">{DEMO_NEXT_CHECKIN}</div>
        </div>
      </div>
    </div>
  );
}
