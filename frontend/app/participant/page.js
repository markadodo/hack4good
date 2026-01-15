'use client';


import { useState } from "react";
import events from "../data/events";


export default function ParticipantDashboard() {
   const [currentDate, setCurrentDate] = useState(new Date());


   // Modal States
   const [registeringActivity, setRegisteringActivity] = useState(null);
   const [removingBooking, setRemovingBooking] = useState(null); // { date: "...", activityName: "..." }


   // Tracks confirmed bookings: { "2026-01-15": ["Activity Name"], ... }
   const [bookedEvents, setBookedEvents] = useState({});


   const year = currentDate.getFullYear();
   const month = currentDate.getMonth();
   const firstDayOfMonth = new Date(year, month, 1).getDay();
   const daysInMonth = new Date(year, month + 1, 0).getDate();
   const monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
   ];


   // Actions
   const confirmRegistration = () => {
       if (!registeringActivity) return;
       setBookedEvents((prev) => ({
           ...prev,
           [registeringActivity.date]: [...(prev[registeringActivity.date] || []), registeringActivity.name]
       }));
       setRegisteringActivity(null);
   };


   const confirmRemoval = () => {
       if (!removingBooking) return;
       setBookedEvents((prev) => {
           const updated = { ...prev };
           // Remove specific activity from that date
           updated[removingBooking.date] = updated[removingBooking.date].filter(
               name => name !== removingBooking.activityName
           );
           // Clean up empty dates
           if (updated[removingBooking.date].length === 0) delete updated[removingBooking.date];
           return updated;
       });
       setRemovingBooking(null);
   };


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
                       // If booked, prepare for removal
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
                       !userBookings.includes(e.name) && (
                           <div key={e.id} className="event-pill available">{e.name}</div>
                       )
                   ))}
               </div>
           </div>
       );
   }


   return (
       <div className="dashboard-container">
           {/* Top Blue Panel & Slider */}
           <div className="blue-panel">
               <h1>Participant Dashboard</h1>
               <div className="slider-wrapper">
                   <div className="activity-slider">
                       {events.map((event) => (
                           <div key={event.id} className="slider-card">
                               <h3>{event.name}</h3>
                               <p>📍 {event.location} | 🕒 {event.time}</p>
                               <button className="register-btn" onClick={() => setRegisteringActivity(event)}>Register</button>
                           </div>
                       ))}
                   </div>
               </div>
           </div>


           {/* MODAL 1: Registration Confirmation */}
           {registeringActivity && (
               <div className="modal-overlay">
                   <div className="modal-content">
                       <h2>Confirm Registration</h2>
                       <p>Register for <strong>{registeringActivity.name}</strong>?</p>
                       <div className="modal-actions">
                           <button className="cancel-btn" onClick={() => setRegisteringActivity(null)}>Cancel</button>
                           <button className="confirm-btn" onClick={confirmRegistration}>Confirm</button>
                       </div>
                   </div>
               </div>
           )}


           {/* MODAL 2: Remove Booking Confirmation */}
           {removingBooking && (
               <div className="modal-overlay">
                   <div className="modal-content border-red">
                       <h2 className="text-red">Manage Booking</h2>
                       <p>You have booked: <strong>{removingBooking.activityName}</strong></p>
                       <p className="modal-hint">Do you want to cancel this booking?</p>
                       <div className="modal-actions">
                           <button className="cancel-btn" onClick={() => setRemovingBooking(null)}>Go Back</button>
                           <button className="remove-btn" onClick={confirmRemoval}>Remove Booking</button>
                       </div>
                   </div>
               </div>
           )}


           {/* Calendar Grid */}
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

