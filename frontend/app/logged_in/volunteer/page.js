'use client';

import { useState, useEffect } from "react";

export default function VolunteerDashboard() {
   const [activities, setActivities] = useState([]); // State for backend data
   const [currentDate, setCurrentDate] = useState(new Date());
   const [isLoading, setIsLoading] = useState(true);

   // Modal States
   const [volunteeringActivity, setVolunteeringActivity] = useState(null);
   const [removingVolunteerBooking, setRemovingVolunteerBooking] = useState(null);

   // Tracks confirmed volunteer slots
   const [volunteerBookings, setVolunteerBookings] = useState({});

   // Fetch activities from backend
   useEffect(() => {
       const fetchActivities = async () => {
           try {
               setIsLoading(true);
               const res = await fetch("http://localhost:8080/activities?limit=99");
               const data = await res.json();
               
               if (data.activities) {
                   // Map backend fields to frontend UI fields
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
                   }));
                   setActivities(formatted);
               }
           } catch (err) { 
               console.error("Failed to fetch activities", err); 
           } finally {
               setIsLoading(false);
           }
       };

       fetchActivities();
   }, []);

   const year = currentDate.getFullYear();
   const month = currentDate.getMonth();
   const firstDayOfMonth = new Date(year, month, 1).getDay();
   const daysInMonth = new Date(year, month + 1, 0).getDate();
   const monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
   ];

   const confirmVolunteering = () => {
       if (!volunteeringActivity) return;
       setVolunteerBookings((prev) => ({
           ...prev,
           [volunteeringActivity.date]: [...(prev[volunteeringActivity.date] || []), volunteeringActivity.name]
       }));
       setVolunteeringActivity(null);
       alert("Thank you for volunteering!");
   };

   const confirmRemoval = () => {
       if (!removingVolunteerBooking) return;
       setVolunteerBookings((prev) => {
           const updated = { ...prev };
           updated[removingVolunteerBooking.date] = updated[removingVolunteerBooking.date].filter(
               name => name !== removingVolunteerBooking.activityName
           );
           if (updated[removingVolunteerBooking.date].length === 0) delete updated[removingVolunteerBooking.date];
           return updated;
       });
       setRemovingVolunteerBooking(null);
   };

   const days = [];
   for (let i = 0; i < firstDayOfMonth; i++) {
       days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
   }

   for (let d = 1; d <= daysInMonth; d++) {
       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
       const userVolunteerSlots = volunteerBookings[dateStr] || [];
       
       // Filter from the dynamic activities state
       const availableEvents = activities.filter(e => e.date === dateStr);
       const isBooked = userVolunteerSlots.length > 0;

       days.push(
           <div
               key={d}
               className={`calendar-day ${isBooked ? 'booked-day' : ''}`}
               onClick={() => {
                   if (isBooked) {
                       setRemovingVolunteerBooking({ date: dateStr, activityName: userVolunteerSlots[0] });
                   }
               }}
           >
               <span className="day-number">{d}</span>
               <div className="day-events">
                   {userVolunteerSlots.map((name, i) => (
                       <div key={`v-booked-${i}`} className="event-pill booked volunteer-pill">🤝 {name}</div>
                   ))}
                   {availableEvents.map(e => (
                       !userVolunteerSlots.includes(e.name) && (
                           <div key={e.id} className="event-pill available">{e.name}</div>
                       )
                   ))}
               </div>
           </div>
       );
   }

   return (
       <div className="dashboard-container">
           <div className="blue-panel volunteer-theme">
               <h1>Volunteer Dashboard</h1>
               <p>Your support makes a difference. Pick an activity to help out!</p>

               <div className="slider-wrapper">
                   <div className="activity-slider">
                       {isLoading ? (
                           <p style={{color: 'white'}}>Loading volunteer opportunities...</p>
                       ) : activities.length > 0 ? (
                           activities.map((event) => (
                               <div key={event.id} className="slider-card">
                                   <h3>{event.name}</h3>
                                   <p>📍 {event.location} | 🕒 {event.time}</p>
                                   <button className="volunteer-btn" onClick={() => setVolunteeringActivity(event)}>Volunteer</button>
                               </div>
                           ))
                       ) : (
                           <p style={{color: 'white'}}>No activities found.</p>
                       )}
                   </div>
               </div>
           </div>

           {/* MODAL: Confirm Volunteering */}
           {volunteeringActivity && (
               <div className="modal-overlay">
                   <div className="modal-content">
                       <h2>Volunteer Confirmation</h2>
                       <p>Are you sure you want to volunteer for <strong>{volunteeringActivity.name}</strong>?</p>
                       <div className="modal-actions">
                           <button className="cancel-btn" onClick={() => setVolunteeringActivity(null)}>Cancel</button>
                           <button className="confirm-btn volunteer-confirm" onClick={confirmVolunteering}>Confirm Help</button>
                       </div>
                   </div>
               </div>
           )}

           {/* MODAL: Cancel Volunteering */}
           {removingVolunteerBooking && (
               <div className="modal-overlay">
                   <div className="modal-content border-red">
                       <h2 className="text-red">Cancel Support</h2>
                       <p>Remove your volunteer slot for: <strong>{removingVolunteerBooking.activityName}</strong>?</p>
                       <div className="modal-actions">
                           <button className="cancel-btn" onClick={() => setRemovingVolunteerBooking(null)}>Go Back</button>
                           <button className="remove-btn" onClick={confirmRemoval}>Remove Slot</button>
                       </div>
                   </div>
               </div>
           )}

           <div className="calendar-section">
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
           </div>
       </div>
   );
}