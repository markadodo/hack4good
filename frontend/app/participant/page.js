'use client';


import { useState } from "react";
import events from "../data/events";


export default function ParticipantDashboard() {
   const [currentDate, setCurrentDate] = useState(new Date());
   const [registeringActivity, setRegisteringActivity] = useState(null);
   const [removingBooking, setRemovingBooking] = useState(null); // Added for Step 3/4
   const [bookedEvents, setBookedEvents] = useState({});
   const [showInstructions, setShowInstructions] = useState(false);


   // Highlighting states for specific steps
   const [isStep1Active, setIsStep1Active] = useState(false);
   const [isStep3Active, setIsStep3Active] = useState(false);


   // STEP 1 Action: Highlight Slider
   const triggerStep1 = () => {
       setIsStep1Active(true);
       setTimeout(() => setIsStep1Active(false), 4000);
   };


   // STEP 3 Action: Highlight Calendar
   const triggerStep3 = () => {
       setIsStep3Active(true);
       setTimeout(() => setIsStep3Active(false), 4000);
   };


   // Calendar Logic (Year/Month/Grid)
   const year = currentDate.getFullYear();
   const month = currentDate.getMonth();
   const firstDayOfMonth = new Date(year, month, 1).getDay();
   const daysInMonth = new Date(year, month + 1, 0).getDate();
   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


   const days = [];
   for (let i = 0; i < firstDayOfMonth; i++) {
       days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
   }


   for (let d = 1; d <= daysInMonth; d++) {
       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
       const userBookings = bookedEvents[dateStr] || [];
       const availableEvents = events.filter(e => e.date === dateStr);
       const isBooked = userBookings.length > 0;


       days.push(
           <div
               key={d}
               className={`calendar-day ${isBooked ? 'booked-day' : ''}`}
               onClick={() => {
                   if (isBooked) {
                       // Triggers the removal modal when a booked day is clicked
                       setRemovingBooking({ date: dateStr, activityName: userBookings[0] });
                   }
               }}
           >
               <span className="day-number">{d}</span>
               <div className="day-events">
                   {userBookings.map((name, i) => (
                       <div key={`booked-${i}`} className="event-pill booked">★ {name}</div>
                   ))}
                   {availableEvents.map(e => (
                       !userBookings.includes(e.name) && <div key={e.id} className="event-pill available">{e.name}</div>
                   ))}
               </div>
           </div>
       );
   }


   return (
       <div className="dashboard-container">
           <div className="blue-panel">
               <div className="header-flex">
                   <h1>Participant Dashboard</h1>
                   <button className="instructions-toggle" onClick={() => setShowInstructions(!showInstructions)}>
                       {showInstructions ? "Hide Instructions" : "How to Use"}
                   </button>
               </div>


               {showInstructions && (
                   <div className="instructions-tab">
                       <div className="step-row">
                           <button className="step-btn-yellow" onClick={triggerStep1}>Step 1</button>
                           <p>Select activity to participate</p>
                       </div>
                       <div className="step-row">
                           <p><strong>Step 2:</strong> Press confirm to participate</p>
                       </div>
                       <div className="step-row">
                           <button className="step-btn-yellow" onClick={triggerStep3}>Step 3</button>
                           <p>To remove booking, press the activity shown on the date box</p>
                       </div>
                       <div className="step-row">
                           <p><strong>Step 4:</strong> Press confirm to remove booking</p>
                       </div>
                   </div>
               )}


               {/* SLIDER AREA with Step 1 Hint Bubble */}
               <div className={`slider-wrapper ${isStep1Active ? 'active-highlight' : ''}`} style={{ position: 'relative' }}>


                   {/* The Hint Bubble for Step 1 */}
                   {isStep1Active && (
                       <div className="hint-bubble step1-bubble">
                           Click Register!
                       </div>
                   )}


                   <div className="activity-slider">
                       {events.map((event) => (
                           <div key={event.id} className="slider-card">
                               <h3>{event.name}</h3>
                               <p>📍 {event.location}</p>
                               <button className="register-btn" onClick={() => setRegisteringActivity(event)}>Register</button>
                           </div>
                       ))}
                   </div>
               </div>
           </div>


           {/* MODAL 1: Registration (Step 2) */}
           {registeringActivity && (
               <div className="modal-overlay">
                   <div className="modal-content">
                       <h2>Confirm Participation</h2>
                       <p>Do you want to join <strong>{registeringActivity.name}</strong>?</p>
                       <div className="modal-actions">
                           <button className="cancel-btn" onClick={() => setRegisteringActivity(null)}>Cancel</button>
                           <button className="confirm-btn" onClick={() => {
                               setBookedEvents(prev => ({ ...prev, [registeringActivity.date]: [...(prev[registeringActivity.date] || []), registeringActivity.name] }));
                               setRegisteringActivity(null);
                           }}>Confirm</button>
                       </div>
                   </div>
               </div>
           )}


           {/* MODAL 2: Removal (Step 4) */}
           {removingBooking && (
               <div className="modal-overlay">
                   <div className="modal-content">
                       <h2 style={{color: '#ef4444'}}>Remove Booking</h2>
                       <p>Stop participating in <strong>{removingBooking.activityName}</strong>?</p>
                       <div className="modal-actions">
                           <button className="cancel-btn" onClick={() => setRemovingBooking(null)}>Go Back</button>
                           <button className="confirm-btn" style={{backgroundColor: '#ef4444'}} onClick={() => {
                               setBookedEvents(prev => {
                                   const updated = { ...prev };
                                   updated[removingBooking.date] = updated[removingBooking.date].filter(name => name !== removingBooking.activityName);
                                   if (updated[removingBooking.date].length === 0) delete updated[removingBooking.date];
                                   return updated;
                               });
                               setRemovingBooking(null);
                           }}>Confirm Removal</button>
                       </div>
                   </div>
               </div>
           )}


           {/* CALENDAR AREA with Step 3 Hint Bubble */}
           <div className={`calendar-section ${isStep3Active ? 'active-highlight' : ''}`}>
               {isStep3Active && <div className="hint-bubble">Click your booked activity to remove!</div>}
               <div className="calendar-controls">
                   <button onClick={() => setCurrentDate(new Date(year, month - 1))}>&lt;</button>
                   <h2>{monthNames[month]} {year}</h2>
                   <button onClick={() => setCurrentDate(new Date(year, month + 1))}>&gt;</button>
               </div>
               <div className="calendar-grid">{days}</div>
           </div>
       </div>
   );
}



// 'use client';


// import { useState } from "react";
// import events from "../data/events";


// export default function ParticipantDashboard() {
//    const [currentDate, setCurrentDate] = useState(new Date());


//    // Modal States
//    const [registeringActivity, setRegisteringActivity] = useState(null);
//    const [removingBooking, setRemovingBooking] = useState(null); // { date: "...", activityName: "..." }


//    // Tracks confirmed bookings: { "2026-01-15": ["Activity Name"], ... }
//    const [bookedEvents, setBookedEvents] = useState({});


//    const year = currentDate.getFullYear();
//    const month = currentDate.getMonth();
//    const firstDayOfMonth = new Date(year, month, 1).getDay();
//    const daysInMonth = new Date(year, month + 1, 0).getDate();
//    const monthNames = ["January", "February", "March", "April", "May", "June",
//        "July", "August", "September", "October", "November", "December"
//    ];


//    // Actions
//    const confirmRegistration = () => {
//        if (!registeringActivity) return;
//        setBookedEvents((prev) => ({
//            ...prev,
//            [registeringActivity.date]: [...(prev[registeringActivity.date] || []), registeringActivity.name]
//        }));
//        setRegisteringActivity(null);
//    };


//    const confirmRemoval = () => {
//        if (!removingBooking) return;
//        setBookedEvents((prev) => {
//            const updated = { ...prev };
//            // Remove specific activity from that date
//            updated[removingBooking.date] = updated[removingBooking.date].filter(
//                name => name !== removingBooking.activityName
//            );
//            // Clean up empty dates
//            if (updated[removingBooking.date].length === 0) delete updated[removingBooking.date];
//            return updated;
//        });
//        setRemovingBooking(null);
//    };


//    const days = [];
//    for (let i = 0; i < firstDayOfMonth; i++) {
//        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
//    }


//    for (let d = 1; d <= daysInMonth; d++) {
//        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
//        const userBookings = bookedEvents[dateStr] || [];
//        const availableEvents = events.filter(e => e.date === dateStr);
//        const isBooked = userBookings.length > 0;


//        days.push(
//            <div
//                key={d}
//                className={`calendar-day ${isBooked ? 'booked-day' : ''}`}
//                onClick={() => {
//                    if (isBooked) {
//                        // If booked, prepare for removal
//                        setRemovingBooking({ date: dateStr, activityName: userBookings[0] });
//                    }
//                }}
//            >
//                <span className="day-number">{d}</span>
//                <div className="day-events">
//                    {userBookings.map((name, i) => (
//                        <div key={`booked-${i}`} className="event-pill booked">★ {name}</div>
//                    ))}
//                    {availableEvents.map(e => (
//                        !userBookings.includes(e.name) && (
//                            <div key={e.id} className="event-pill available">{e.name}</div>
//                        )
//                    ))}
//                </div>
//            </div>
//        );
//    }


//    return (
//        <div className="dashboard-container">
//            {/* Top Blue Panel & Slider */}
//            <div className="blue-panel">
//                <h1>Participant Dashboard</h1>
//                <div className="slider-wrapper">
//                    <div className="activity-slider">
//                        {events.map((event) => (
//                            <div key={event.id} className="slider-card">
//                                <h3>{event.name}</h3>
//                                <p>📍 {event.location} | 🕒 {event.time}</p>
//                                <button className="register-btn" onClick={() => setRegisteringActivity(event)}>Register</button>
//                            </div>
//                        ))}
//                    </div>
//                </div>
//            </div>


//            {/* MODAL 1: Registration Confirmation */}
//            {registeringActivity && (
//                <div className="modal-overlay">
//                    <div className="modal-content">
//                        <h2>Confirm Registration</h2>
//                        <p>Register for <strong>{registeringActivity.name}</strong>?</p>
//                        <div className="modal-actions">
//                            <button className="cancel-btn" onClick={() => setRegisteringActivity(null)}>Cancel</button>
//                            <button className="confirm-btn" onClick={confirmRegistration}>Confirm</button>
//                        </div>
//                    </div>
//                </div>
//            )}


//            {/* MODAL 2: Remove Booking Confirmation */}
//            {removingBooking && (
//                <div className="modal-overlay">
//                    <div className="modal-content border-red">
//                        <h2 className="text-red">Manage Booking</h2>
//                        <p>You have booked: <strong>{removingBooking.activityName}</strong></p>
//                        <p className="modal-hint">Do you want to cancel this booking?</p>
//                        <div className="modal-actions">
//                            <button className="cancel-btn" onClick={() => setRemovingBooking(null)}>Go Back</button>
//                            <button className="remove-btn" onClick={confirmRemoval}>Remove Booking</button>
//                        </div>
//                    </div>
//                </div>
//            )}


//            {/* Calendar Grid */}
//            <div className="calendar-section">
//                <div className="calendar-controls">
//                    <button onClick={() => setCurrentDate(new Date(year, month - 1))}>&lt;</button>
//                    <h2>{monthNames[month]} {year}</h2>
//                    <button onClick={() => setCurrentDate(new Date(year, month + 1))}>&gt;</button>
//                </div>
//                <div className="calendar-grid">
//                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                        <div key={day} className="calendar-header-day">{day}</div>
//                    ))}
//                    {days}
//                </div>
//            </div>
//        </div>
//    );
// }

