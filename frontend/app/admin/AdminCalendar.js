'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, MapPin, Users, Trash2, Edit, X } from "lucide-react";

export default function AdminCalendar({ refreshTrigger }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:8080/logged_in/admin/activities", { withCredentials: true });
      setActivities(res.data || []);
    } catch (err) { console.error("Fetch failed", err); }
  };

  useEffect(() => { fetchActivities(); }, [refreshTrigger, currentDate]);

  // CALENDAR GENERATION LOGIC
  const renderDays = () => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={emptyDayStyle}></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayActs = activities.filter(act => new Date(act.start_time).toISOString().split('T')[0] === dateStr);

      days.push(
        <div key={d} style={dayBoxStyle}>
          <span style={dayNumStyle}>{d}</span>
          <div style={eventContainerStyle}>
            {dayActs.map(act => (
              <div key={act.id} onClick={() => setSelectedActivity(act)} style={eventPillStyle}>
                {act.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div style={{ padding: '10px' }}>
      {/* CALENDAR HEADER */}
      <div style={calendarHeaderStyle}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>{monthNames[month]} {year}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={navBtnStyle}><ChevronLeft size={18}/></button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={navBtnStyle}><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* THE GRID (Ensure this is present!) */}
      <div style={calendarGridStyle}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={weekdayLabelStyle}>{day}</div>
        ))}
        {renderDays()}
      </div>

      {/* DETAIL MODAL (Keep your existing modal code here) */}
      {selectedActivity && (
          <div style={modalOverlayStyle}>
              {/* ... Modal Content ... */}
          </div>
      )}
    </div>
  );
}

// STYLES FOR RENDERING
const calendarGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' };
const weekdayLabelStyle = { padding: '12px', textAlign: 'center', backgroundColor: '#f8fafc', fontWeight: 'bold', fontSize: '0.8rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' };
const dayBoxStyle = { minHeight: '100px', padding: '8px', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff' };
const emptyDayStyle = { ...dayBoxStyle, backgroundColor: '#fcfcfc' };
const dayNumStyle = { fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' };
const eventPillStyle = { backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', marginTop: '4px', cursor: 'pointer', borderLeft: '3px solid #1d4ed8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const calendarHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const navBtnStyle = { padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer' };
const eventContainerStyle = { display: 'flex', flexDirection: 'column', gap: '2px' };