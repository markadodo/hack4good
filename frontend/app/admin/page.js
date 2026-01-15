'use client';


import { useState } from "react";
import eventsData from "../data/events";


export default function AdminDashboard() {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [events, setEvents] = useState(eventsData);


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


 const addEvent = () => {
   if (!name || !date || !time) { alert("Please fill in the details"); return; }
   const newEvent = { id: Date.now(), name, date, time, location, slots: parseInt(slots), registered: 0 };
   setEvents([...events, newEvent]);
   setName(""); setDate(""); setTime(""); setLocation(""); setSlots(1);
 };


 const deleteEvent = (id) => {
   if (confirm("Delete this activity?")) {
     setEvents(events.filter((e) => e.id !== id));
   }
 };


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
     </div>
 );
}
