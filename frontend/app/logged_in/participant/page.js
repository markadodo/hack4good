

'use client';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

import { useState, useEffect } from "react";

function getToken() {
  return localStorage.getItem("token");
}

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to parse JWT:", err);
    return null;
  }
}

function userID() {
  const token = getToken();
  const payload = parseJwt(token);
  return payload?.user_id || null; 
}


export default function ParticipantDashboard() {
  const [activities, setActivities] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [registeringActivity, setRegisteringActivity] = useState(null);
  const [removingBooking, setRemovingBooking] = useState(null);
  const [bookedEvents, setBookedEvents] = useState({});
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [volunteeringActivity, setVolunteeringActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [clashData, setClashData] = useState(null);


  // Updated Fetch Logic
  useEffect(() => {
      const fetchActivities = async () => {
          try {
              setIsLoading(true);
              const res = await fetch(`${apiUrl}/activities?limit=99`);
              const data = await res.json();




              if (data.activities) {
                  // Map backend fields to frontend UI fields
                  const formatted = data.activities.map(a => ({
                      id: a.id,
                      name: a.title, // 'title' becomes 'name'
                      description: a.description,
                      // Extracting YYYY-MM-DD for the calendar filter
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



  // Highlighting states for specific steps
  const [isStep1Active, setIsStep1Active] = useState(false);
  const [isStep3Active, setIsStep3Active] = useState(false);

  const triggerStep1 = () => {
      setIsStep1Active(true);
      setTimeout(() => setIsStep1Active(false), 4000);
  };

  const triggerStep3 = () => {
      setIsStep3Active(true);
      setTimeout(() => setIsStep3Active(false), 4000);
  };


  // Calendar Logic
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
      // dateStr will be in format YYYY-MM-DD
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const userBookings = bookedEvents[dateStr] || [];
      const availableEvents = activities.filter(e => e.date === dateStr);
      const isBooked = userBookings.length > 0;



      days.push(
          <div
              key={d}
              className={`calendar-day ${isBooked ? 'booked-day' : ''}`}
              onClick={() => {
                  if (isBooked) {
                      setRemovingBooking({ date: dateStr, activityName: userBookings[0] });
                  }
              }}
          >
              <span className="day-number">{d}</span>
              <div className="day-events">
                  {userBookings.map((name, i) => (
                      <div key={`booked-${i}`} className="event-pill booked">★ {name}</div>
                  ))}
                  {availableEvents.map(activity => (
                      !userBookings.includes(activity.name) && (
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
  // New Function: The Voice Engine
  const speakInstruction = (text) => {
      // Cancel any existing speech so they don't overlap
      window.speechSynthesis.cancel();




      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
  };

    const handleFinalRegistration = async (activity) => {
        try {
            const payload = {
                user_id: userID(), // Extracted from your cookie utility
                activity_id: activity.id,
                meetup_location: "Main Entrance"
            };

            const res = await fetch(`${apiUrl}/logged_in/registrations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Successfully registered!");
                // Update the calendar with a star icon
                setBookedEvents(prev => ({
                    ...prev,
                    [activity.date]: [...(prev[activity.date] || []), activity.name]
                }));
                return true;
            } else {
                const errorData = await res.json();
                alert(`Registration failed: ${errorData.error}`);
                return false;
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Could not connect to the server.");
            return false;
        }
    };






  return (
      <div className="dashboard-container">
          <div className="blue-panel">
              <div className="header-flex">
                <h1>Participant Dashboard</h1>
                  {/* <button className="step-btn-yellow" onClick={() => setShowInstructions(!showInstructions)}>
                      {showInstructions ? "Hide Instructions" : "How to Use"}
                  </button> */}
                <button 
                  className="step-btn-yellow" 
                  onClick={() => setShowInstructions(!showInstructions)}
                    style={{
                        display: 'flex',            // Use flexbox for alignment
                        alignItems: 'center',       // Center icon and text vertically
                        justifyContent: 'center',   // Center content horizontally
                        gap: '12px',                // Space between icon and text
                        padding: '12px 24px',       // Make the button larger
                        fontSize: '1.1rem',         // Larger text
                        fontWeight: 'bold',
                        minWidth: '200px',          // Ensure consistent width
                        borderRadius: '12px',
                        transition: 'transform 0.2s' // Smooth interaction
                    }}
                >
                    <img 
                        src="/icons8-question-mark-64.png" 
                        alt="Question Icon" 
                        style={{ width: '28px', height: '28px' }} 
                    />
                    {showInstructions ? "Hide Instructions" : "How to Use"}
                </button>

              </div>








              {showInstructions && (
                  <div className="instructions-tab">
                      <div className="step-row">
                          <button className="step-btn-yellow" onClick={triggerStep1}>Step 1</button>
                          <p>Select activity to participate</p>
                          {/* Voice Button */}
                          <button className="voice-btn" onClick={() => speakInstruction("Step 1. Select an activity to participate.")} aria-label="Listen to instruction">
                              🔊
                          </button>
                      </div>




                      <div className="step-row">
                          <p><strong>Step 2:</strong> Press confirm to participate</p>
                          <button className="voice-btn" onClick={() => speakInstruction("Step 2. Press confirm to participate.")}>
                              🔊
                          </button>
                      </div>




                      <div className="step-row">
                          <button className="step-btn-yellow" onClick={triggerStep3}>Step 3</button>
                          <p>To remove booking, press the activity on the calendar</p>
                          <button className="voice-btn" onClick={() => speakInstruction("Step 3. To remove booking, press the activity shown on the date box.")}>
                              🔊
                          </button>
                      </div>




                      <div className="step-row">
                          <p><strong>Step 4:</strong> Press confirm to remove booking</p>
                          <button className="voice-btn" onClick={() => speakInstruction("Step 4. Press confirm to remove booking.")}>
                              🔊
                          </button>
                      </div>
                  </div>
              )}








              <div className={`slider-wrapper ${isStep1Active ? 'active-highlight' : ''}`} style={{ position: 'relative' }}>
                  {isStep1Active && <div className="hint-bubble step1-bubble">Click Register!</div>}








                  <div className="activity-slider">
                      {isLoading ? (
                          <p>Loading activities...</p>
                      ) : activities.length > 0 ? (
                          activities.map((event) => (
                              <div key={event.id} className="slider-card">
                                  <h3>{event.name}</h3>
                                  <p>📍 {event.location}</p>
                                  <p>⏰ {event.time}</p>
                                  <button className="register-btn" onClick={() => setRegisteringActivity(event)}>Register</button>
                              </div>
                          ))
                      ) : (
                          <p>No activities found.</p>
                      )}
                  </div>
              </div>
          </div>








          {/* Modals remain the same as they use the mapped 'event' properties */}
          {registeringActivity && (
              <div className="modal-overlay">
                  <div className="modal-content">
                      <h2>Confirm Participation</h2>
                      <p>Do you want to join <strong>{registeringActivity.name}</strong>?</p>
                      <div className="modal-actions">
                          <button className="cancel-btn" onClick={() => setRegisteringActivity(null)}>Cancel</button>
                          <button className="confirm-btn" onClick={async() => {
                               const existingActivitiesOnDate = bookedEvents[registeringActivity.date] || [];
                     
                                if (existingActivitiesOnDate.length > 0) {
                                    // Show the beautified custom modal instead of window.confirm
                                    setClashData({
                                        newActivity: registeringActivity,
                                        existingCount: existingActivitiesOnDate.length
                                    });
                                    return; // Stop and wait for user to interact with the clash modal
                                }
                                handleFinalRegistration(registeringActivity);
                                setRegisteringActivity(null);

                               try {
                                   const payload = {
                                       user_id: userID(), // You should replace this with the actual logged-in user's ID
                                       activity_id: registeringActivity.id,
                                       meetup_location: "Main Entrance" // Default location
                                   };
                          
                                   const res = await fetch(`${apiUrl}/logged_in/registrations`, {
                                       method: "POST",
                                       headers: { "Content-Type": "application/json" },
                                       credentials: "include",
                                       body: JSON.stringify(payload)
                                   });
                          
                                   if (res.ok) {
                                       alert("Successfully registered!");
                                       // Optional: update local state to show '★' on calendar immediately
                                       setBookedEvents(prev => ({
                                           ...prev,
                                           [registeringActivity.date]: [...(prev[registeringActivity.date] || []), registeringActivity.name]
                                       }));
                                   } else {
                                       const errorData = await res.json();
                                       alert(`Registration failed: ${errorData.error}`);
                                   }
                               } catch (err) {
                                   console.error("Network error:", err);
                               }


                              setBookedEvents(prev => ({
                                  ...prev,
                                  [registeringActivity.date]: [...(prev[registeringActivity.date] || []), registeringActivity.name]
                              }));
                              setRegisteringActivity(null);
                          }}>Confirm</button>
                      </div>
                  </div>
              </div>
          )}







            {/* MODAL: Friendly Remove Booking (Step 4) */}
            {removingBooking && (
                <div className="modal-overlay">
                    <div className="modal-content professional-modal border-red friendly-modal">
                        <div className="friendly-header">
                            <span className="big-icon">🗑️</span>
                            <h2>Cancel This Activity?</h2>
                        </div>
                        <div className="modal-body">
                            <p className="friendly-text">Do you want to stop going to:</p>
                            <div className="activity-highlight-card large-card red-highlight">
                                <strong>{removingBooking.activityName}</strong>
                            </div>
                            <p className="friendly-hint">
                                Press "Yes, Cancel it" to remove it from your calendar.
                            </p>
                        </div>
                        <div className="modal-actions-v2 large-actions">
                            <button className="cancel-btn-v2 big-btn" onClick={() => setRemovingBooking(null)}>
                                No, Keep it
                            </button>
                            <button className="remove-btn-v2 big-btn" onClick={() => {
                                // ... (keep your existing removal logic here) ...
                                setBookedEvents(prev => {
                                    const updated = { ...prev };
                                    updated[removingBooking.date] = updated[removingBooking.date].filter(name => name !== removingBooking.activityName);
                                    if (updated[removingBooking.date].length === 0) delete updated[removingBooking.date];
                                    return updated;
                                });
                                setRemovingBooking(null);
                            }}>
                                Yes, Cancel it
                            </button>
                        </div>
                    </div>
                </div>
            )}





          <div className={`calendar-section ${isStep3Active ? 'active-highlight' : ''}`}>
              {isStep3Active && <div className="hint-bubble">Click your booked activity to remove!</div>}
              <div className="calendar-controls">
                  <button onClick={() => setCurrentDate(new Date(year, month - 1))}>&lt;</button>
                  <h2>{monthNames[month]} {year}</h2>
                  <button onClick={() => setCurrentDate(new Date(year, month + 1))}>&gt;</button>
              </div>
              <div className="calendar-grid">{days}</div>
          </div>








 {/* MODAL: Professional Activity Details */}
{selectedActivity && (
    <div className="modal-overlay" onClick={() => setSelectedActivity(null)}>
        <div className="modal-content pro-modal-v2" onClick={(e) => e.stopPropagation()}>
            <div className="pro-header-v2 blue-bg">
                <img 
                    src="/icons8-info.gif" 
                    alt="Info Icon" 
                    className="huge-icon-v2" 
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
                />
                {/* <span className="huge-icon-v2">ℹ️</span> */}
                <span className="label-v2">Activity Details</span>
            </div>

            <div className="modal-body">
                <h1 className="modal-main-title">{selectedActivity.name}</h1>

                <div className="pro-panel-v2 description-v2">
                    <p className="label-v2">What to Expect</p>
                    <p className="friendly-text">{selectedActivity.description || "No description provided."}</p>
                </div>

                <div className="logistics-grid-v2">
                    <div className="logistics-card-v2">
                        <p className="label-v2">📍 Where</p>
                        <p className="friendly-value">{selectedActivity.location}</p>
                    </div>
                    <div className="logistics-card-v2">
                        <p className="label-v2">⏰ When</p>
                        <p className="friendly-value">{selectedActivity.time}</p>
                    </div>
                </div>

                <div className="pro-panel-v2 requirements-v2">
                    <p className="label-v2">Access & Fees</p>
                    <div className="req-row-v2">
                        <span>{selectedActivity.wheelchair_access ? "✅" : "❌"} Wheelchair</span>
                        <span>{selectedActivity.payment_required ? "💰" : "🆓"} {selectedActivity.payment_required ? "Paid" : "Free"}</span>
                    </div>
                </div>
            </div>

            <div className="pro-footer-v2">
                <button className="btn-v2 btn-sec" onClick={() => setSelectedActivity(null)}>Close</button>
                <button className="btn-v2 btn-pri" onClick={() => { setRegisteringActivity(selectedActivity); setSelectedActivity(null); }}>Register for this</button>
            </div>
        </div>
    </div>
)}

{clashData && (
    <div className="modal-overlay">
        <div className="modal-content pro-modal-v2" style={{ borderTop: '8px solid #facc15' }}>
            <div className="pro-header-v2" style={{ backgroundColor: '#fefce8' }}>
                <img 
                    src="/icons8-question-mark-64.png" 
                    alt="Warning" 
                    style={{ width: '60px', height: '60px' }} 
                />
                <span className="label-v2" style={{ color: '#854d0e' }}>Schedule Alert</span>
            </div>

            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
                <h2 style={{ color: '#1e293b', marginBottom: '15px' }}>Potential Timing Clash!</h2>
                <p className="friendly-text">
                    You already have <strong>{clashData.existingCount} activity</strong> scheduled for this date.
                </p>
                <div className="pro-panel-v2" style={{ backgroundColor: '#fffbeb', border: '1px solid #fef08a', margin: '20px 0' }}>
                    <p style={{ color: '#854d0e', fontSize: '0.95rem' }}>
                        "Please take note that your timing of activities is happening on the same date, 
                        please check the timing to avoid clashes."
                    </p>
                </div>
                <p className="friendly-hint">Would you still like to proceed with the registration?</p>
            </div>

            <div className="pro-footer-v2">
                <button className="btn-v2 btn-sec" onClick={() => setClashData(null)}>
                    Go Back & Check
                </button>
                <button className="btn-v2 btn-pri" style={{ backgroundColor: '#facc15', color: '#854d0e' }} onClick={() => {
                    handleFinalRegistration(clashData.newActivity);
                    setClashData(null);
                }}>
                    Yes, Register Anyway
                </button>
            </div>
        </div>
    </div>
)}




          {/* / */}
      </div>
  );
}




