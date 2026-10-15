import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';

interface HealthReading {
  id: string;
  label: string;
  value: string;
  unit: string;
  date: string;
  enteredBy: string;
}

interface DashboardResponse {
  healthReadings: HealthReading[];
}

/**
 * Health snapshot card — loads sample readings from the Sahaara API.
 * These are still fictional demo records, not real patient data.
 */
export function HealthSnapshotCard() {
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReadings() {
      try {
        const response = await fetch(
          'http://localhost:3002/api/dashboard',
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error('Could not load health readings');
        }

        const data: DashboardResponse = await response.json();
        setReadings(data.healthReadings ?? []);
        setError(false);
      } catch (requestError) {
        if (
          requestError instanceof Error &&
          requestError.name === 'AbortError'
        ) {
          return;
        }

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadReadings();

    return () => controller.abort();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon green">
          <Activity />
        </div>
        <h2>Recent Health Snapshot</h2>
      </div>

      <div className="example-data-label">
        <FlaskConical size={12} />
        Sample records from API — not real patient data
      </div>

      {loading && <p role="status">Loading health readings…</p>}

      {error && (
        <p role="alert">
          Could not load readings. Check that the Sahaara API is running.
        </p>
      )}

      {!loading && !error && readings.length === 0 && (
        <p>No health readings are available.</p>
      )}

      {!loading &&
        !error &&
        readings.map((reading) => (
          <div className="health-reading" key={reading.id}>
            <div>
              <div className="health-reading-label">{reading.label}</div>
              <div className="health-reading-meta">
                {reading.date} · {reading.enteredBy}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div className="health-reading-value">{reading.value}</div>
              <div className="health-reading-meta">{reading.unit}</div>
            </div>
          </div>
        ))}

      <Link to="/health" className="view-link" id="link-health-history">
        View health history
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}