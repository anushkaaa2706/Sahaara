import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import {
  HealthPage,
  MedicinesPage,
  AppointmentsPage,
  CareCirclePage,
} from './pages/PlaceholderPages';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/care-circle" element={<CareCirclePage />} />
      </Routes>
    </AppShell>
  );
}
