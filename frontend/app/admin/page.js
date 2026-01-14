'use client';

import { useState } from "react";
import eventsData from "../data/events";
import axios from "axios"; //run 'npm install axios'
import AddButtonForm from "./Addbuttonform"; //take note
import AdminCalendar from "./AdminCalendar"; //take note //npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction axios

export default function Admin() {
  const [events, setEvents] = useState(eventsData);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [slots, setSlots] = useState(1);

  //For the 'Add Event' button
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    meetup_location: "", 
    start_time: "",
    end_time: "",
    wheelchair_access: false,
    payment_required: false,
    participant_vacancy: 0,
    volunteer_vacancy: 0,
    created_by: 1 // Example ID
  });
  //for Calendar related 
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitEvent = async () => {
    try {
      // Prepare data for backend (converting string to array for MeetupLocation)
      const payload = {
        ...formData,
        meetup_location: formData.meetup_location.split(",").map(s => s.trim()),
        participant_vacancy: parseInt(formData.participant_vacancy),
        volunteer_vacancy: parseInt(formData.volunteer_vacancy),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };

      // API call to your backend
      await axios.post("http://localhost:8080/logged_in/admin/activities", payload, { withCredentials: true });
      
      setIsModalOpen(false); // Close modal on success
      alert("Activity Created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create activity");
    }
  };


  

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        alignItems: 'stretch', // Ensures both boxes have the same height
        position: 'relative', // Add this
        zIndex: 1
      }}>
        
        {/* Analytics Box */}
        <div className="event-card" style={{ flex: 1, margin: 0 }}>
          <h2>Analytics</h2>
          <p>Total Events: {events.length}</p>
          <p>Total Registrations: {events.reduce((sum, e) => sum + (e.registered || 0), 0)}</p>
          <p>Popular Event: {events.sort((a, b) => (b.registered || 0) - (a.registered || 0))[0]?.name || "None"}</p>
        </div>

        {/* Add Event Box */}
        <div className="event-card" style={{ flex: 1, margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2>Click to add Event</h2> 
          
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '20px 30px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            + Add Event
          </button>

          <AddButtonForm 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            formData={formData}
            onChange={handleInputChange}
            onSubmit={submitEvent}
          />
         
       </div>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Activity Calendar</h2>
        <AdminCalendar refreshTrigger={refreshTrigger} />
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