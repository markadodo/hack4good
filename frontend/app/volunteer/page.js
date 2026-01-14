'use client';

import { useState } from "react";
import events from "../data/events";

export default function Volunteer() {
  const [selectedDate, setSelectedDate] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const filteredEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  const toggleRegister = (id) => {
    setRegistrations((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="page">
      <h1>Volunteer Dashboard</h1>
      <div className="event-card">
        <h2>Leaderboard</h2>
        <p>Top Volunteers:</p>
        <ul>
          <li>Volunteer A: 10 events</li>
          <li>Volunteer B: 8 events</li>
          <li>You: {registrations.length} events</li>
        </ul>
      </div>
      <label>Select date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <div>
        {selectedDate === "" && <p>Please select a date to view activities.</p>}
        {filteredEvents.length === 0 && selectedDate !== "" && <p>No activities on this date.</p>}
        {filteredEvents.map((event) => {
          const isRegistered = registrations.includes(event.id);
          const isFull = (event.registered || 0) >= event.slots;
          return (
            <div
              key={event.id}
              className={`event-card ${isRegistered ? "registered" : ""} ${isFull ? "full" : ""}`}
            >
              <h2>{event.name}</h2>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Slots left:</strong> {event.slots - (event.registered || 0)}</p>
              <button
                onClick={() => toggleRegister(event.id)}
                disabled={isFull}
              >
                {isRegistered ? "Cancel" : isFull ? "Full" : "Register"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}