// frontend/app/logged-in/admin/signups.js
'use client';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { useState, useEffect } from "react";

const membership_type = ["tier 1", "tier 2", "tier 3", "tier 4"]

export default function SignUps({ activity, onClose }) {
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activity.id]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Fetch registrations for this activity
            const regRes = await fetch(`${apiUrl}/logged_in/activities/${activity.id}/registrations?limit=99`, { credentials: "include" });
            const regData = await regRes.json();

            // Fetch all users to map IDs to names and roles
            const userRes = await fetch(`${apiUrl}/logged_in/users`, { credentials: "include" });
            const userData = await userRes.json();

            if (regData.registrations) setRegistrations(regData.registrations);
            if (userData.users) setUsers(userData.users);
        } catch (err) {
            console.error("Failed to fetch sign-up data", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to get user details by ID
    const getUserById = (id) => users.find(u => u.id === id) || { username: "Unknown", role: "N/A" };

    // Filter registrations by role
    const volunteers = registrations.filter(r => getUserById(r.user_id).role === 'volunteer');
    const participants = registrations.filter(r => getUserById(r.user_id).role === 'participant');

    return (
        <div className="modal-overlay">
            <div className="modal-content user-mgmt-large-box" style={{ maxWidth: '900px' }}>
                <div className="modal-header">
                    <div>
                        <h2 style={{ color: '#1e293b' }}>Sign-ups: {activity.name}</h2>
                        <p style={{ color: '#64748b' }}>Managing volunteers and participants for this session.</p>
                    </div>
                    <button className="btn-cancel" onClick={onClose}>Close</button>
                </div>

                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>Loading records...</div>
                ) : (
                    <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
                        {/* Volunteer List */}
                        <div className="signup-section">
                            <h3 style={{ color: '#059669', marginBottom: '15px' }}>🤝 Volunteers ({volunteers.length})</h3>
                            <table className="pro-table">
                                <thead>
                                    <tr><th>Name</th></tr>
                                </thead>
                                <tbody>
                                    {volunteers.map(reg => (
                                        <tr key={reg.id}>
                                            <td>{getUserById(reg.user_id).username}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Participant List */}
                        <div className="signup-section">
                            <h3 style={{ color: '#2563eb', marginBottom: '15px' }}>👥 Participants ({participants.length})</h3>
                            <table className="pro-table">
                                <thead>
                                    <tr><th>Name</th><th>membership type</th></tr>
                                </thead>
                                <tbody>
                                    {participants.map(reg => (
                                        <tr key={reg.id}>
                                            <td>{getUserById(reg.user_id).username}</td>
                                            <td>{membership_type[getUserById(reg.user_id).membership_type]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}