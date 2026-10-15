import { CareCompanionCard } from '../components/CareCompanionCard';
import { useEffect, useState } from 'react';
import { DEMO_USER } from '../data/demoData';
import { QuickHelpCard } from '../components/QuickHelpCard';
import { DailyCheckInCard } from '../components/DailyCheckInCard';
import { TodaysCareCard } from '../components/TodaysCareCard';
import { HealthSnapshotCard } from '../components/HealthSnapshotCard';
import { CareCircleCard } from '../components/CareCircleCard';

interface DashboardResponse {
  patient: {
    firstName: string;
    role: string;
  };
}

export function DashboardPage() {
  const [firstName, setFirstName] = useState(DEMO_USER.firstName);
  const [apiConnected, setApiConnected] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        const response = await fetch('http://localhost:3002/api/dashboard', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Could not load dashboard data');
        }

        const data: DashboardResponse = await response.json();

        if (!data.patient?.firstName) {
          throw new Error('Dashboard response is missing the patient name');
        }

        setFirstName(data.patient.firstName);
        setApiConnected(true);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setApiConnected(false);
      }
    }

    loadDashboard();

    return () => controller.abort();
  }, []);

  return (
    <>
      
<div className="dashboard-greeting">
  <h1>
    {greeting}, {firstName}
  </h1>
  <p>Here's your care overview for today.</p>
  <p className="dashboard-greeting-note">
    Your personal care dashboard
  </p>
</div>


      <div className="dashboard-grid">
        <div className="card-full-width">
  <CareCompanionCard />
</div>
        <QuickHelpCard />
        <DailyCheckInCard />

        <div className="card-full-width">
          <TodaysCareCard />
        </div>

        <HealthSnapshotCard />
        <CareCircleCard />
      </div>
    </>
  );
}