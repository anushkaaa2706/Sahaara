import { CareCircleCard } from '../components/CareCircleCard';
import { Link } from 'react-router-dom';
import {
  Heart,
  Pill,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
interface PlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
}

function PlaceholderLayout({ title, description, icon: Icon }: PlaceholderProps) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        <Icon size={40} />
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link to="/" className="btn btn-outline" id={`link-back-from-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
}

export function HealthPage() {
  return (
    <PlaceholderLayout
      title="Health"
      description="Your full health history, readings, and records will appear here. This screen is coming soon."
      icon={Heart}
    />
  );
}

export function MedicinesPage() {
  return (
    <PlaceholderLayout
      title="Medicines"
      description="Your medication schedule, reminders, and history will appear here. This screen is coming soon."
      icon={Pill}
    />
  );
}

export function AppointmentsPage() {
  return (
    <PlaceholderLayout
      title="Appointments"
      description="Your upcoming appointments and past visit notes will appear here. This screen is coming soon."
      icon={Calendar}
    />
  );
}

export function CareCirclePage() {
  return (
    <div className="page-content">
      <CareCircleCard />
    </div>
  );
}