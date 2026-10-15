
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  FlaskConical,
  HeartPulse,
  Droplet,
} from 'lucide-react';

const SAMPLE_READINGS = [
  {
    id: 'bp',
    label: 'Blood pressure',
    value: '124/82',
    unit: 'mmHg',
    date: 'Today, 9:15 AM',
    icon: HeartPulse,
  },
  {
    id: 'hr',
    label: 'Heart rate',
    value: '76',
    unit: 'bpm',
    date: 'Today, 9:15 AM',
    icon: Activity,
  },
  {
    id: 'sugar',
    label: 'Blood glucose',
    value: '102',
    unit: 'mg/dL',
    date: 'Yesterday, 8:30 AM',
    icon: Droplet,
  },
];

export function HealthSnapshotCard() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon green">
          <Activity />
        </div>

        <div>
          <h2>Recent Health Snapshot</h2>
          <p className="health-card-subtitle">
            A quick look at your recorded readings
          </p>
        </div>
      </div>

      <div className="example-data-label">
        <FlaskConical size={13} />
        Illustrative sample data · Not real patient readings
      </div>

      <div className="health-snapshot-list">
        {SAMPLE_READINGS.map((reading) => {
          const Icon = reading.icon;

          return (
            <div className="health-reading" key={reading.id}>
              <div className="health-reading-left">
                <div className="health-reading-symbol">
                  <Icon size={18} />
                </div>

                <div>
                  <div className="health-reading-label">
                    {reading.label}
                  </div>
                  <div className="health-reading-meta">
                    {reading.date}
                  </div>
                </div>
              </div>

              <div className="health-reading-right">
                <div className="health-reading-value">
                  {reading.value}
                </div>
                <div className="health-reading-meta">
                  {reading.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/health" className="view-link" id="link-health-history">
        View health history
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
