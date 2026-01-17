'use client';


import { useState, useEffect } from "react";
import eventsData from "../../data/events";
import UserManagement from "./userManagement";
import SignUps from "./signups";


export default function AdminDashboard() {
 const [currentDate, setCurrentDate] = useState(new Date());
 const [events, setEvents] = useState(eventsData);
 const [selectedEvent, setSelectedEvent] = useState(null); //state management for activity updates
 const [showUserMgmt, setShowUserMgmt] = useState(false); //user management 


 // Form States
 const [name, setName] = useState("");
 const [date, setDate] = useState("");
 const [time, setTime] = useState("");
 const [location, setLocation] = useState("");
 const [slots, setSlots] = useState(1);
 const [description, setDescription] = useState("");
 const [volunteerSlots, setVolunteerSlots] = useState(1);
const [wheelchairAccess, setWheelchairAccess] = useState(false);
const [paymentRequired, setPaymentRequired] = useState(false);


 // Calendar Logic
 const year = currentDate.getFullYear();
 const month = currentDate.getMonth();
 const firstDayOfMonth = new Date(year, month, 1).getDay();
 const daysInMonth = new Date(year, month + 1, 0).getDate();
 const monthNames = ["January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"
 ];

 const [showSignups, setShowSignups] = useState(null);

 


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
    const res = await fetch("http://localhost:8080/activities?limit=99");
    const data = await res.json();
    if (data.activities) {
      // Map backend 'title' to frontend 'name' and 'start_time' to 'date' for UI compatibility
      const formatted = data.activities.map(a => ({
        id: a.id,
        name: a.title,
        description: a.description,
        // Extracting YYYY-MM-DD for the calendar filter logic
        date: a.start_time.split('T')[0], 
        time: a.start_time.split('T')[1].substring(0, 5),
        location: a.location,
        slots: a.participant_vacancy,
        volunteer_vacancy: a.volunteer_vacancy,
        wheelchair_access: a.wheelchair_access,
        payment_required: a.payment_required
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
  if (!name || !date || !time || !description) { alert("Please fill in the details"); return; }

  // Formatting backend StartTime and EndTime
  // We combine date and time from the form.
  const startDateTime = new Date(`${date}T${time}:00Z`);
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
  
  const payload = {
    title: name,
    description: description, // New field
    location: location,
    meetup_location: ["Main Entrance"],
    start_time: new Date(`${date}T${time}:00Z`),
    end_time: new Date(`${date}T${time}:00Z`), 
    wheelchair_access: wheelchairAccess, 
    payment_required: paymentRequired,   
    participant_vacancy: parseInt(slots),
    volunteer_vacancy: parseInt(volunteerSlots), // New field
    created_by: 1 
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
      
      setName("");
      setDate("");
      setTime("");
      setLocation("");
      setDescription("");
      setSlots(1);
      setVolunteerSlots(1);
      setWheelchairAccess(false);
      setPaymentRequired(false);

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
        description: selectedEvent.description,
        location: selectedEvent.location,
        participant_vacancy: parseInt(selectedEvent.slots),
        volunteer_vacancy: parseInt(selectedEvent.volunteer_vacancy), // Added
        wheelchair_access: selectedEvent.wheelchair_access, // Added
        payment_required: selectedEvent.payment_required
      })
    });
    if (res.ok) {
      fetchActivities();
      setSelectedEvent(null);
    } else {
      const errorData = await res.json();
      alert(`Update failed: ${errorData.error}`);
    }
  } catch (err) { 
      console.error("Update error:", err);
      alert("Update failed: Could not connect to the server.");
   }
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
      fetchActivities();
      setSelectedEvent(null);
    } else {
      const errorData = await res.json();
      alert(`Delete failed: ${errorData.error}`);
    }
  } catch (err) { alert("Delete failed: Network error"); }
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
              //  <div key={e.id} className="event-pill admin-pill" onClick={() => deleteEvent(e.id)}>
              //    🗑️ {e.name}
              //  </div>
              <div 
               key={e.id} 
               className="event-pill admin-pill" 
               onClick={() => setSelectedEvent(e)} // Opens the detail box
               >
               {e.name}
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
            <h1>Admin Dashboard
              <button 
                  className="glass-submit-btn" 
                  style={{ background: 'royalblue', marginLeft: '100px' }}
                  onClick={() => setShowUserMgmt(true)}
              >
                Manage User Accounts
              </button>

            </h1>
            <p>Create and manage the STEP programme schedule below.</p>
            <h2 style={{ margin: '10px' }}> Add activity </h2>
            
        </div>

        {/* Integrated Glass Form with Two Rows */}
        <div className="glass-form">
          {/* Row 1: Primary Details */}
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
          </div>

        {/* Row 2: Vacancy & Description */}
        <div className="form-row" style={{ marginTop: '20px' }}>
          <div className="field" style={{ flex: '2' }}>
            <label>Description</label>
            <input placeholder="Brief details..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="field narrow">
            <label>Participant Slots</label>
            <input type="number" value={slots} min="1" onChange={e => setSlots(e.target.value)} />
          </div>
          <div className="field narrow">
            <label>Volunteer Slots</label>
            <input type="number" value={volunteerSlots} min="1" onChange={e => setVolunteerSlots(e.target.value)} />
          </div>
        
        {/* Toggles Group */}
        <div className="field" style={{ flex: '0 0 auto', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.7rem' }}>Access/Payment</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="checkbox" 
                title="Wheelchair Access" 
                checked={wheelchairAccess} 
                onChange={e => setWheelchairAccess(e.target.checked)} 
              />
              <input 
                type="checkbox" 
                title="Payment Required" 
                checked={paymentRequired} 
                onChange={e => setPaymentRequired(e.target.checked)} 
              />
            </div>
          </div>
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
        
        {/* Main add-activity box */}
        {selectedEvent && (
          <div className="modal-overlay">
            <div className="modal-content text-left" style={{ maxWidth: '500px', width: '90%' }}>
              <h2 className="text-blue-900" style={{ marginBottom: '20px' }}>Edit Activity</h2>
              <div className="modal-details" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
                <label>Activity Title</label>
                  <input 
                    value={selectedEvent.name} 
                    onChange={e => setSelectedEvent({...selectedEvent, name: e.target.value})} 
                  />
                  <label>Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Describe the activity..."
                    value={selectedEvent.description || ""} 
                    onChange={e => setSelectedEvent({...selectedEvent, description: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px' }}
                  />
                  <label>Location</label>
                  <input 
                    value={selectedEvent.location} 
                    onChange={e => setSelectedEvent({...selectedEvent, location: e.target.value})} 
                  />
              <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Participant Vacancy</label>
                  <input 
                    type="number" 
                    min="0"
                    value={selectedEvent.slots} 
                    onChange={e => setSelectedEvent({...selectedEvent, slots: e.target.value})} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Volunteer Vacancy</label>
                  <input 
                    type="number" 
                    min="0"
                    value={selectedEvent.volunteer_vacancy || 0} 
                    onChange={e => setSelectedEvent({...selectedEvent, volunteer_vacancy: e.target.value})} 
                  />
                </div>
              </div>

            {/* RECTIFIED: Checkbox Fields now use selectedEvent state and dark text */}
            <div className="field" style={{ flex: '1', minWidth: '250px', marginTop: '15px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                REQUIREMENTS
              </label>
              <div style={{ display: 'flex', gap: '25px', alignItems: 'center', height: '42px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedEvent.wheelchair_access || false} 
                    onChange={e => setSelectedEvent({...selectedEvent, wheelchair_access: e.target.checked})} 
                  />
                    Wheelchair Access
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedEvent.payment_required || false} 
                    onChange={e => setSelectedEvent({...selectedEvent, payment_required: e.target.checked})} 
                  />
                  Payment Required
                </label>
              </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '25px' }}>
              <button 
                className="glass-submit-btn" 
                style={{ 
                  background: '#0f172a', 
                  marginRight: 'auto', 
                  display: 'flex',           // Enable Flexbox
                  justifyContent: 'center',  // Center horizontally
                  alignItems: 'center',      // Center vertically
                  textAlign: 'center',       // Ensure text lines are centered if wrapped
                  padding: '0 15px',         // Horizontal padding for spacing
                  minHeight: '42px',         // Matches your other buttons
                  lineHeight: '1.2'          // Tightens space between wrapped lines
                }}
                onClick={() => setShowSignups(selectedEvent)}
              >
                View Sign Ups
              </button>
              <button className="confirm-btn" onClick={handleUpdate}>Update</button>
              <button className="remove-btn" onClick={() => handleDelete(selectedEvent.id)}>Delete</button>
              <button className="cancel-btn" onClick={() => setSelectedEvent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      )}
      {/* USER MANAGEMENT MODAL */}
      {showUserMgmt && (
        <UserManagement onClose={() => setShowUserMgmt(false)} />
      )} 

      {/* SIGN UPS MODAL */}
      {showSignups && (
        <SignUps 
            activity={showSignups} 
            onClose={() => setShowSignups(null)} 
        />
      )}     
      </div>
 );
}

