// AddButtonForm.js
'use client';

export default function AddButtonForm({ isOpen, onClose, formData, onChange, onSubmit }) {
  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dim the background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Extremely high to stay above the calendar and navbar
    backdropFilter: 'blur(4px)', // Optional: blurs the calendar grid behind the form
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '550px',
    maxHeight: '85vh',
    overflowY: 'auto',
    position: 'relative', // Ensures content stays inside the box
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    zIndex: 10000, // Higher than overlay
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
          Create New Activity
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {/* Form fields remain the same logic-wise, but ensure they use your inputStyle */}
          <input name="title" value={formData.title} placeholder="Event Title" onChange={onChange} style={inputStyle} />
          <textarea name="description" value={formData.description} placeholder="Detailed Description" onChange={onChange} style={{ ...inputStyle, minHeight: '80px' }} />
          
          <input name="location" value={formData.location} placeholder="General Location" onChange={onChange} style={inputStyle} />
          <input name="meetup_location" value={formData.meetup_location} placeholder="Meetup Points (comma separated)" onChange={onChange} style={inputStyle} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input name="start_time" type="datetime-local" value={formData.start_time} onChange={onChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input name="end_time" type="datetime-local" value={formData.end_time} onChange={onChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Participant Slots</label>
              <input name="participant_vacancy" type="number" value={formData.participant_vacancy} onChange={onChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Volunteer Slots</label>
              <input name="volunteer_vacancy" type="number" value={formData.volunteer_vacancy} onChange={onChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={checkboxLabelStyle}>
              <input name="wheelchair_access" type="checkbox" checked={formData.wheelchair_access} onChange={onChange} /> Wheelchair Access
            </label>
            <label style={checkboxLabelStyle}>
              <input name="payment_required" type="checkbox" checked={formData.payment_required} onChange={onChange} /> Payment Required
            </label>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button onClick={onSubmit} style={submitBtnStyle}>Create Activity</button>
            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Styles
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' };
const submitBtnStyle = { flex: 2, backgroundColor: '#3b82f6', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const cancelBtnStyle = { flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };