'use client';

import { useState } from "react";
import events from "../data/events";

export default function Participant() {
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
  const filteredEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : events.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <h1>Participant Dashboard</h1>
      <input
        type="text"
        placeholder="Search events by name or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <label>Select date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <div>
        {selectedDate === "" && search === "" && <p>Please select a date or search for events.</p>}
        {filteredEvents.length === 0 && (selectedDate !== "" || search !== "") && <p>No events found.</p>}
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.name}</h2>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Slots:</strong> {event.slots - (event.registered || 0)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}