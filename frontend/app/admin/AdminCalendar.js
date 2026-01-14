'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export default function AdminCalendar({ refreshTrigger }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);


  const modalOverlayStyle = { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999, // Ensure this is also high
    backdropFilter: 'blur(4px)'
  };
  
  const modalContentStyle = { 
    backgroundColor: 'white', 
    padding: '30px', 
    borderRadius: '16px', 
    width: '400px', 
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
    zIndex: 10000 
  };

  // Fetch activities from backend
  const fetchActivities = async () => {
    try {
      const res = await axios.get('http://localhost:8080/logged_in/admin/activities', { withCredentials: true });
      const formatted = res.data.map(act => ({
        id: act.id.toString(),
        title: act.title,
        start: act.start_time,
        end: act.end_time,
        backgroundColor: act.volunteer_vacancy > 0 ? '#22c55e' : '#ef4444', // Green if open, Red if closed
        extendedProps: { ...act }
      }));
      setEvents(formatted);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => { fetchActivities(); }, [refreshTrigger]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await axios.delete(`http://localhost:8080/logged_in/admin/activities/${selectedEvent.id}`, { withCredentials: true });
      setIsEditOpen(false);
      fetchActivities();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '12px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        height="60vh"
      />

      {/* View/Edit Modal */}
      {isEditOpen && selectedEvent && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Event: {selectedEvent.title}</h3>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Volunteers Needed:</strong> {selectedEvent.volunteer_vacancy}</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => alert("Update logic here")} style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', padding: '10px', borderRadius: '5px' }}>Update</button>
              <button onClick={handleDelete} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', padding: '10px', borderRadius: '5px' }}>Delete</button>
              <button onClick={() => setIsEditOpen(false)} style={{ flex: 1, backgroundColor: '#94a3b8', color: 'white', padding: '10px', borderRadius: '5px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px' };