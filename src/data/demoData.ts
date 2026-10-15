/**
 * Demo data for the Sahaara prototype.
 * All records are fictional and clearly labelled as sample data.
 * Structured for easy replacement with API responses later.
 */

export interface CareContact {
  id: string;
  name: string;
  initials: string;
  relationship: string;
  phone: string;
}

export interface HealthReading {
  id: string;
  label: string;
  value: string;
  unit: string;
  date: string;
  enteredBy: string;
}

export interface MedicineReminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  with: string;
}

export const DEMO_USER = {
  firstName: 'Margaret',
  role: 'Older Adult' as const,
};

export const DEMO_CONTACTS: CareContact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Johnson',
    initials: 'SJ',
    relationship: 'Daughter',
    phone: '(555) 012-3456',
  },
  {
    id: 'contact-2',
    name: 'Dr. Amara Patel',
    initials: 'AP',
    relationship: 'Primary Care Doctor',
    phone: '(555) 789-0123',
  },
  {
    id: 'contact-3',
    name: 'James Johnson',
    initials: 'JJ',
    relationship: 'Son-in-law',
    phone: '(555) 456-7890',
  },
];

export const DEMO_HEALTH_READINGS: HealthReading[] = [
  {
    id: 'reading-1',
    label: 'Blood Pressure',
    value: '128/82',
    unit: 'mmHg',
    date: 'Oct 13, 2026',
    enteredBy: 'Dr. Patel',
  },
  {
    id: 'reading-2',
    label: 'Pulse',
    value: '72',
    unit: 'bpm',
    date: 'Oct 13, 2026',
    enteredBy: 'Dr. Patel',
  },
  {
    id: 'reading-3',
    label: 'Weight',
    value: '154',
    unit: 'lbs',
    date: 'Oct 10, 2026',
    enteredBy: 'Self',
  },
];

export const DEMO_MEDICINE: MedicineReminder = {
  id: 'med-1',
  name: 'Lisinopril',
  dosage: '10 mg',
  time: '8:00 AM',
};

export const DEMO_APPOINTMENT: Appointment = {
  id: 'appt-1',
  title: 'Check-up visit',
  date: 'Oct 18, 2026',
  time: '10:30 AM',
  with: 'Dr. Amara Patel',
};

export const DEMO_NEXT_CHECKIN = 'Today at 6:00 PM';
