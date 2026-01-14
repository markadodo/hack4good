'use client';

import { useState } from "react";
import eventsData from "../data/events";

export default function Admin() {
  const [events, setEvents] = useState(eventsData);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [slots, setSlots] = useState(1);

  const addEvent = () => {
    const newEvent = {
      id: Date.now(),
      name,
      date,
      time,
      location,
      slots: parseInt(slots),
      registered: 0,
    };
    setEvents((prev) => [...prev, newEvent]);
    setName(""); setDate(""); setTime(""); setLocation(""); setSlots(1);
  };

  const deleteEvent = (id) => setEvents(events.filter((e) => e.id !== id));

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <div className="event-card">
        <h2>Analytics</h2>
        <p>Total Events: {events.length}</p>
        <p>Total Registrations: {events.reduce((sum, e) => sum + (e.registered || 0), 0)}</p>
        <p>Popular Event: {events.sort((a, b) => (b.registered || 0) - (a.registered || 0))[0]?.name || "None"}</p>
      </div>

      <div className="event-card">
        <h2>Add Event</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Time" value={time} onChange={e => setTime(e.target.value)} />
        <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input type="number" value={slots} min="1" onChange={e => setSlots(e.target.value)} />
        <button onClick={addEvent}>Add Event</button>
      </div>

      <h2>Existing Events</h2>
      <button onClick={() => {
        const csv = events.map(e => `${e.name},${e.date},${e.time},${e.location},${e.slots}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.csv';
        a.click();
      }}>Export Events as CSV</button>
      {events.map(e => (
        <div key={e.id} className="event-card">
          <h3>{e.name}</h3>
          <p><strong>Date:</strong> {e.date}</p>
          <p><strong>Time:</strong> {e.time}</p>
          <p><strong>Location:</strong> {e.location}</p>
          <p><strong>Slots:</strong> {e.slots}</p>
          <button onClick={() => deleteEvent(e.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}