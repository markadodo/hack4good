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

   const [selectedActivity, setSelectedActivity] = useState(null);

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

   const confirmVolunteering = async() => {

    //    if (!volunteeringActivity) return;
    //    setVolunteerBookings((prev) => ({
    //        ...prev,
    //        [volunteeringActivity.date]: [...(prev[volunteeringActivity.date] || []), volunteeringActivity.name]
    //    }));
    if (!volunteeringActivity) return;

        try {
            const payload = {
                user_id: 1, // Replace with actual logged-in user ID
                activity_id: volunteeringActivity.id,
                meetup_location: volunteeringActivity.location // Use activity location as meetup
            };

            const res = await fetch("http://localhost:8080/logged_in/registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setVolunteerBookings((prev) => ({
                    ...prev,
                    [volunteeringActivity.date]: [...(prev[volunteeringActivity.date] || []), volunteeringActivity.name]
                }));
                alert("Thank you for volunteering!");
            } else {
                alert("Failed to save volunteer record.");
            }
        } catch (err) {
            console.error("Error:", err);
        }
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
                   {availableEvents.map(activity => (
                    !userVolunteerSlots.includes(activity.name) && (
                    <div 
                        key={activity.id} 
                        className="event-pill available"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents clicking the day itself
                            // FIX: Pass the 'activity' object directly from the map
                            setSelectedActivity(activity); 
                        }}
                    >
                        {activity.name}
                    </div>
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

           {/* MODAL: Activity Details */}
           {selectedActivity && ( 
            <div className="modal-overlay" onClick={() => setSelectedActivity(null)}>
                <div className="modal-content professional-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{selectedActivity.name}</h2>
                        <span className="badge">Activity Details</span>
                    </div>
            
                <div className="modal-body text-left">
                    <div className="detail-section" style= {{backgroundColor: 'cornsilk', padding: '5px 10px', borderRadius: '8px'}}>
                        <p><strong>Description:</strong></p>
                        <p className="description-text">{selectedActivity.description || "No description provided."}</p>
                    </div>

                    <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: 'Palegreen', padding: '50px 10px', borderRadius: '8px'}}>
                        <p>📍 <strong>Location:</strong> {selectedActivity.location}</p>
                        <p>🕒 <strong>Time:</strong> {selectedActivity.time}</p>
                        <p>🤝 <strong>Volunteer Vacancy:</strong> {selectedActivity.volunteer_vacancy}</p>
                        <p>👥 <strong>Participant Slots:</strong> {selectedActivity.slots}</p>
                    </div>

                    <div className="requirements-row" style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', backgroundColor: 'cornsilk' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>REQUIREMENTS</p>
                        <div style={{ display: 'flex', gap: '20px'}}>
                            <span>{selectedActivity.wheelchair_access ? "✅" : "❌"} Wheelchair Access</span>
                            <span>{selectedActivity.payment_required ? "💰" : "🆓"} Payment Required</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={() => setSelectedActivity(null)}>Close</button>
                    <button 
                        className="confirm-btn volunteer-confirm" 
                        onClick={() => {
                            setVolunteeringActivity(selectedActivity);
                            setSelectedActivity(null);
                        }}
                    >
                        Volunteer for this
                    </button>
                </div>
        </div>
    </div>
)}


           
        
    </div>
)}


    