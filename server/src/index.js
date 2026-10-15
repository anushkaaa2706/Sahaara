import express from "express";
import cors from "cors";

const app = express();
const PORT = 3002;

app.use(
  cors({
   origin: [
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5176",
  "http://127.0.0.1:5176",
],
  })
);

app.use(express.json());

app.get("/api/status", (_request, response) => {
  response.json({ message: "Sahaara API is running" });
});

app.get("/api/dashboard", (_request, response) => {
  response.json({
    patient: {
      firstName: "Margaret",
      role: "Older Adult",
    },

    healthReadings: [
      {
        id: "reading-1",
        label: "Blood Pressure",
        value: "128/82",
        unit: "mmHg",
        date: "Oct 13, 2026",
        enteredBy: "Dr. Patel",
      },
      {
        id: "reading-2",
        label: "Pulse",
        value: "72",
        unit: "bpm",
        date: "Oct 13, 2026",
        enteredBy: "Dr. Patel",
      },
      {
        id: "reading-3",
        label: "Weight",
        value: "154",
        unit: "lbs",
        date: "Oct 10, 2026",
        enteredBy: "Self",
      },
    ],

    medicine: {
      id: "med-1",
      name: "Lisinopril",
      dosage: "10 mg",
      time: "8:00 AM",
    },

    appointment: {
      id: "appt-1",
      title: "Check-up visit",
      date: "Oct 19, 2026",
      time: "10:30 AM",
      with: "Dr. Amara Patel",
    },

    nextCheckIn: "Today at 6:00 PM",

    contacts: [
      {
        id: "contact-1",
        name: "Sarah Johnson",
        initials: "SJ",
        relationship: "Daughter",
        phone: "(555) 012-3456",
      },
      {
        id: "contact-2",
        name: "Dr. Amara Patel",
        initials: "AP",
        relationship: "Primary Care Doctor",
        phone: "(555) 789-0123",
      },
      {
        id: "contact-3",
        name: "James Johnson",
        initials: "JJ",
        relationship: "Son-in-law",
        phone: "(555) 456-7890",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Sahaara API running at http://localhost:${PORT}`);
});