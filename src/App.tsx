
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { WelcomePage } from './pages/WelcomePage';
import {
  HealthPage,
  MedicinesPage,
  AppointmentsPage,
  CareCirclePage,
} from './pages/PlaceholderPages';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />

      <Route
        path="/dashboard"
        element={
          <AppShell>
            <DashboardPage />
          </AppShell>
        }
      />

      <Route
        path="/health"
        element={
          <AppShell>
            <HealthPage />
          </AppShell>
        }
      />

      <Route
        path="/medicines"
        element={
          <AppShell>
            <MedicinesPage />
          </AppShell>
        }
      />

      <Route
        path="/appointments"
        element={
          <AppShell>
            <AppointmentsPage />
          </AppShell>
        }
      />

      <Route
        path="/care-circle"
        element={
          <AppShell>
            <CareCirclePage />
          </AppShell>
        }
      />

      <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
