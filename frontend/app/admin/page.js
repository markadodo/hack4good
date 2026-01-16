'use client';


import { useState, useEffect } from "react";
import eventsData from "../data/events";


export default function AdminDashboard() {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [events, setEvents] = useState(eventsData);
 const [selectedEvent, setSelectedEvent] = useState(null); //state management for activity updates


 // Form States
 const [name, setName] = useState("");
 const [date, setDate] = useState("");
 const [time, setTime] = useState("");
 const [location, setLocation] = useState("");
 const [slots, setSlots] = useState(1);


 // Calendar Logic
 const year = currentDate.getFullYear();
 const month = currentDate.getMonth();
 const firstDayOfMonth = new Date(year, month, 1).getDay();
 const daysInMonth = new Date(year, month + 1, 0).getDate();
 const monthNames = ["January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"
 ];


//  const addEvent = () => {
//    if (!name || !date || !time) { alert("Please fill in the details"); return; }
//    const newEvent = { id: Date.now(), name, date, time, location, slots: parseInt(slots), registered: 0 };
//    setEvents([...events, newEvent]);
//    setName(""); setDate(""); setTime(""); setLocation(""); setSlots(1);
//  };


//  const deleteEvent = (id) => {
//    if (confirm("Delete this activity?")) {
//      setEvents(events.filter((e) => e.id !== id));
//    }
//  };

//new code for activity management: 
useEffect(() => {
  fetchActivities();
}, []);

const fetchActivities = async () => {
  try {
    const res = await fetch("http://localhost:8080/activities?limit=100");
    const data = await res.json();
    if (data.activities) {
      // Map backend 'title' to frontend 'name' and 'start_time' to 'date' for UI compatibility
      const formatted = data.activities.map(a => ({
        id: a.id,
        name: a.title,
        // Extracting YYYY-MM-DD for the calendar filter logic
        date: a.start_time.split('T')[0], 
        time: a.start_time.split('T')[1].substring(0, 5),
        location: a.location,
        slots: a.participant_vacancy
        // ...a,
        // name: a.title,
        // date: a.start_time.split('T')[0],
        // time: a.start_time.split('T')[1].substring(0, 5)
      }));
      setEvents(formatted);
    }
  } catch (err) { console.error("Failed to fetch activities", err); }
};

const addEvent = async () => {
  if (!name || !date || !time) { alert("Please fill in the details"); return; }

  // Formatting backend StartTime and EndTime
  // We combine date and time from the form.
  const startDateTime = new Date(`${date}T${time}:00Z`);
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
  
  const payload = {
    title: name,
    description: "Admin created activity",
    location: location,
    meetup_location: ["Main Entrance"],
    start_time: new Date(`${date}T${time}:00Z`),
    end_time: new Date(`${date}T23:59:00Z`),
    participant_vacancy: parseInt(slots) || 1,
    volunteer_vacancy: 5,
    created_by: 1 // Replace with actual logged-in user ID
  };

  try { //updated 16011400
    const res = await fetch("http://localhost:8080/logged_in/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      alert("Activity added successfully!");
      fetchActivities();
      setName(""); setDate(""); setTime(""); setLocation(""); setSlots(1);
    } else {
      const errorData = await res.json();
      alert(`Failed to add activity: ${errorData.error}`);
    }
  } catch (err) { 
    console.error("Network error:", err);
    alert("Could not connect to the server.");
  }
};

const handleUpdate = async () => {
  try {
    const res = await fetch(`http://localhost:8080/logged_in/activities/${selectedEvent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: selectedEvent.name,
        location: selectedEvent.location,
        participant_vacancy: parseInt(selectedEvent.slots)
      })
    });
    if (res.ok) {
      fetchActivities();
      setSelectedEvent(null);
    }
  } catch (err) { alert("Update failed"); }
};

const handleDelete = async (id) => {
  if (!confirm("Delete this activity permanentely?")) return;
  try {
    const res = await fetch(`http://localhost:8080/logged_in/activities/${id}`, {
      method: "DELETE", 
      credentials: "include"
    });
    if (res.ok) {
      setEvents(events.filter(e => e.id !== id));
      setSelectedEvent(null);
    }
  } catch (err) { alert("Delete failed"); }
};

//below is the older functional code 


 const days = [];
 for (let i = 0; i < firstDayOfMonth; i++) {
   days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
 }


 for (let d = 1; d <= daysInMonth; d++) {
   const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
   const dayEvents = events.filter(e => e.date === dateStr);
   days.push(
       <div key={d} className="calendar-day admin-day">
         <span className="day-number">{d}</span>
         <div className="day-events">
           {dayEvents.map(e => (
               <div key={e.id} className="event-pill admin-pill" onClick={() => deleteEvent(e.id)}>
                 🗑️ {e.name}
               </div>
           ))}
         </div>
       </div>
   );
 }


 return (
     <div className="dashboard-container">
       {/* Integrated Admin Header */}
       <header className="admin-header-v2">
         <div className="admin-header-content">
           <div className="admin-intro">
             <h1>Admin Dashboard</h1>
             <p>Create and manage the STEP programme schedule below.</p>
           </div>


           {/* Integrated Glass Form (No separate panel) */}
           <div className="glass-form">
             <div className="form-row">
               <div className="field">
                 <label>Activity Name</label>
                 <input placeholder="Enter title..." value={name} onChange={e => setName(e.target.value)} />
               </div>
               <div className="field">
                 <label>Date</label>
                 <input type="date" value={date} onChange={e => setDate(e.target.value)} />
               </div>
               <div className="field">
                 <label>Time</label>
                 <input type="time" value={time} onChange={e => setTime(e.target.value)} />
               </div>
               <div className="field">
                 <label>Location</label>
                 <input placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)} />
               </div>
               <div className="field narrow">
                 <label>Slots</label>
                 <input type="number" value={slots} min="1" onChange={e => setSlots(e.target.value)} />
               </div>
               <button className="glass-submit-btn" onClick={addEvent}>
                 <span>Add Activity</span>
               </button>
             </div>
           </div>
         </div>
       </header>


       {/* Calendar Section */}
       <main className="calendar-section">
         <div className="calendar-controls">
           <button onClick={() => setCurrentDate(new Date(year, month - 1))}>&lt;</button>
           <h2>{monthNames[month]} {year}</h2>
           <button onClick={() => setCurrentDate(new Date(year, month + 1))}>&gt;</button>
         </div>
         <div className="calendar-grid">
           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
               <div key={day} className="calendar-header-day">{day}</div>
           ))}
           {days}
         </div>
       </main>
       {/* Edit modal box */}
       {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content text-left">
            <h2 className="text-blue-900">Edit Activity</h2>
            <div className="modal-details">
              <label>Activity Title</label>
              <input 
                value={selectedEvent.name} 
                onChange={e => setSelectedEvent({...selectedEvent, name: e.target.value})} 
              />
              <label>Location</label>
              <input 
                value={selectedEvent.location} 
                onChange={e => setSelectedEvent({...selectedEvent, location: e.target.value})} 
              />
              <label>Available Slots</label>
              <input 
                type="number" 
                value={selectedEvent.slots} 
                onChange={e => setSelectedEvent({...selectedEvent, slots: e.target.value})} 
              />
            </div>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleUpdate}>Update</button>
              <button className="remove-btn" onClick={() => handleDelete(selectedEvent.id)}>Delete</button>
              <button className="cancel-btn" onClick={() => setSelectedEvent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
     </div>
 );
}

