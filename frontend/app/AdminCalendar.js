import React, {useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
//please install: npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction axios



export default function AdminCalendar() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen]= useState(false);
    const [formData, setFormData]= useState({name: '', venue: '', slots:0});
    const [selectedEvent, setSelectedEvent]= useState(null);
    const [isEditModalOpen, setIsEditModalOpen]= useState(false);


    const fetchEvents= async () => {
        try {
            const res= await axios.get('http://localhost:8080/api/events');
            const formatted = res.data.map(e=> ({
            id: e.ID,
            title: e.title,
            start: e.CreatedAt,
            //Requirements: Red if closed, Green if open
            backgroundColor: e.vacancy <=0 ? '#ef4444': '#22c55e',
            extendedProps: {
                location: e.location,
                vacancy: e.vacancy
            }


            }));
            setEvents(formatted);
        } catch (err) {
            console.error("Fetch error: ", err);
        }
    };
    useEffect(()=> {fetchEvents(); }, []);


 //3. Create Event (POST)
    const createNewEvent= async ()=> {
        try {
            await axios.post('http://localhost:8080/api/events', {
            title: formData.name,
            location: formData.venue,
            max_volunteers: Number(formData.slots),
            vacancy: Number(formData.slots)
            });
            setIsModalOpen(false);
            setFormData({name: '', venue: '', slots: 0})
            fetchEvents();
        } catch(error) {
            alert("Failed to save event. Check if Go backend is running on port 8080");
        }
    };


    const deleteEvent = async()=> {
        if (!selectedEvent) return;
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await axios.delete(`http://localhost:8080/api/events/${selectedEvent.id}`);
                setIsEditModalOpen(false);
                fetchEvents(); //Refresh calendar
            } catch (error) {
                alert("Error deleting event");
            }
        }
    };


    const updateEvent = async() => {
        try {
            await axios.put(`http://localhost:8080/api/events/${selectedEvent.id}`, {
                title: formData.name,
                location: formData.venue,
                max_volunteers: Number(formData.slots),
                vacancy: Number(formData.slots) //OR logic to keep current registration
            });
            setIsEditModalOpen(false);
            fetchEvents();
        } catch (error) {
            alert("Error updating event");
        }
    }


    //Click Handler (when user clicks an existing event box)
    const handleEventClick = (info) => {
    const eventData = {
        id: info.event.id,
        name: info.event.title,
        venue: info.event.extendedProps.location,
        slots: info.event.extendedProps.vacancy
    };
        setSelectedEvent(eventData);
        setFormData(eventData); //fill the form with existing data
        setIsEditModalOpen(true);
    }


    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };
    const modalContentStyle = {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '400px'
    };






    return (
    <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>MINDS Admin Activity Manager</h2>
        {/* Nav button */}
        <button
            onClick={() => window.location.href='/admin/accounts'}
            style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '5px' }}
        >
        Manage User Accounts
        </button>
        
        {/* Button to open Modal */}
        <button
            onClick={() => setIsModalOpen(true)}
            style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
        + Create New Event
        </button>
        
        {/* THE CALENDAR */}
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick= {handleEventClick}
            height="70vh"
            eventContent={(eventInfo) => (
                <div style={{ color: 'white', padding: '2px', fontSize: '12px' }}>
                <b>{eventInfo.event.title}</b>
                <div>{eventInfo.event.extendedProps.vacancy} slots left</div>
                </div>
            )}
        />


        {/* THE POP-UP FORM (MODAL) */}
        {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px' }}>
            <h3>Create New Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input placeholder="Event Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input placeholder="Location" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
                <input type="number" placeholder="Volunteer Slots" value={formData.slots} onChange={(e) => setFormData({...formData, slots: e.target.value})} />
                
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={createNewEvent} style={{ flex: 1, backgroundColor: '#22c55e', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>Submit</button>
                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#94a3b8', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>Cancel</button>
                </div>
            </div>
            </div>
        </div>
        )}


        {isEditModalOpen && (
        <div className="modal-overlay" style={modalOverlayStyle}>
            <div className="modal-content" style={modalContentStyle}>
            <h3>Manage Event: {selectedEvent?.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} />
                <input type="number" value={formData.slots} onChange={(e) => setFormData({...formData, slots: e.target.value})} />
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={updateEvent} style={{ flex: 1, backgroundColor: '#3b82f6', color: 'white', padding: '10px', borderRadius: '5px' }}>Update</button>
                <button onClick={deleteEvent} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', padding: '10px', borderRadius: '5px' }}>Delete</button>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} style={{ backgroundColor: '#94a3b8', color: 'white', padding: '10px', borderRadius: '5px' }}>Close</button>
            </div>
            </div>
        </div>
        )}


    </div>
    );


}
