// AddButtonForm.js
'use client';
import { X, MapPin, Clock, Users as UsersIcon, Info } from "lucide-react";

export default function AddButtonForm({ isOpen, onClose, formData, onChange, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeader}>
          <h3>Create New Activity</h3>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        
        <div style={formBody}>
          <div style={inputGroup}>
            <label style={labelStyle}><Info size={14}/> Event Title</label>
            <input name="title" value={formData.title} onChange={onChange} style={inputStyle} placeholder="e.g. Weekly Beach Cleanup" />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><MapPin size={14}/> Location</label>
            <input name="location" value={formData.location} onChange={onChange} style={inputStyle} placeholder="General Address" />
          </div>

          <div style={gridRow}>
            <div style={inputGroup}>
              <label style={labelStyle}><Clock size={14}/> Start Time</label>
              <input name="start_time" type="datetime-local" value={formData.start_time} onChange={onChange} style={inputStyle} />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}><UsersIcon size={14}/> Volunteer Slots</label>
              <input name="volunteer_vacancy" type="number" value={formData.volunteer_vacancy} onChange={onChange} style={inputStyle} />
            </div>
          </div>

          <div style={footerStyle}>
            <button onClick={onClose} style={secondaryBtn}>Cancel</button>
            <button onClick={onSubmit} style={primaryBtn}>Create Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// STYLES
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' };
const modalStyle = { backgroundColor: '#fff', width: '500px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', padding: '20px 25px', borderBottom: '1px solid #f1f5f9', fontWeight: 'bold' };
const formBody = { padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem' };
const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const footerStyle = { display: 'flex', gap: '12px', marginTop: '10px' };
const primaryBtn = { flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const secondaryBtn = { flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };

