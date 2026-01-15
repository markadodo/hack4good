'use client';

import { useState } from "react";
import axios from "axios";
import { Users, Calendar as CalIcon, Plus, LayoutDashboard, Database, Download } from "lucide-react"; //npm install lucid-react
import AddButtonForm from "./Addbuttonform";
import AdminCalendar from "./AdminCalendar";

export default function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formData, setFormData] = useState({
    title: "", description: "", location: "", meetup_location: "",
    start_time: "", end_time: "", wheelchair_access: false,
    payment_required: false, participant_vacancy: 0, volunteer_vacancy: 0,
    created_by: 1
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitEvent = async () => {
    try {
      const payload = {
        ...formData,
        meetup_location: formData.meetup_location.split(",").map(s => s.trim()),
        participant_vacancy: parseInt(formData.participant_vacancy),
        volunteer_vacancy: parseInt(formData.volunteer_vacancy),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      };
      await axios.post("http://localhost:8080/logged_in/admin/activities", payload, { withCredentials: true });
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { alert("Error creating activity"); }
  };

  return (
    <div style={layoutStyle}>
      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        <div style={{ padding: '20px', fontWeight: '800', fontSize: '1.2rem', color: '#fff' }}>HACK4GOOD</div>
        <nav style={navStyle}>
          <div style={activeNavItem}><LayoutDashboard size={20} /> Dashboard</div>
          <div style={navItem} onClick={() => window.location.href = '/admin/users'}>
            <Users size={20} /> Manage Accounts
          </div>
          <div style={navItem}><Database size={20} /> Database Logs</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={mainContentStyle}>
        <header style={headerStyle}>
          <div>
            <h1 style={{ margin: 0, color: '#1e293b' }}>Admin Overview</h1>
            <p style={{ color: '#64748b' }}>Manage your community activities and users.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} style={primaryBtnStyle}>
            <Plus size={18} /> Create New Activity
          </button>
        </header>

        {/* STAT CARDS */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={iconCircleStyle}><CalIcon color="#3b82f6" /></div>
            <div>
              <div style={statLabelStyle}>Total Activities</div>
              <div style={statValueStyle}>12</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={iconCircleStyle}><Users color="#10b981" /></div>
            <div>
              <div style={statLabelStyle}>Active Volunteers</div>
              <div style={statValueStyle}>48</div>
            </div>
          </div>
        </div>

        {/* CALENDAR SECTION */}
        <section style={sectionCardStyle}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalIcon /> Activity Schedule
          </h2>
          <AdminCalendar refreshTrigger={refreshTrigger} />
        </section>

        <AddButtonForm 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          formData={formData}
          onChange={handleInputChange}
          onSubmit={submitEvent}
        />
      </main>
    </div>
  );
}

// STYLES
const layoutStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' };
const sidebarStyle = { width: '260px', backgroundColor: '#1e3a8a', color: '#fff', position: 'fixed', height: '100vh' };
const navStyle = { display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px' };
const navItem = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' };
const activeNavItem = { ...navItem, backgroundColor: '#2563eb' };
const mainContentStyle = { flex: 1, marginLeft: '260px', padding: '40px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' };
const statCardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const iconCircleStyle = { width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const statLabelStyle = { color: '#64748b', fontSize: '0.9rem', fontWeight: '500' };
const statValueStyle = { fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' };
const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' };
const sectionCardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' };


