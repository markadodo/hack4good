'use client';

import { useState, useEffect } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function UserManagement({ onClose }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "participant",
        membership_type: 0
    });

    const closeModals = () => {
        setEditingUser(null);
        setIsCreating(false);
        setFormData({ username: "", password: "", role: "participant", membership_type: 0 });
    };

    useEffect(() => { fetchAllUsers(); }, []);

    const fetchAllUsers = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token"); //new added
            const res = await fetch(`${apiUrl}/logged_in/users`, { 
                headers: {
                    "Authorization": `Bearer ${token}` // new added
                },
                credentials: "include" 

            });
            
            const data = await res.json();
            if (data.users) setUsers(data.users);
        } catch (err) { console.error("Failed to fetch users", err); }
        finally { setIsLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this account?")) return;
        try {
            const res = await fetch(`${apiUrl}/logged_in/users/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok) fetchAllUsers();
        } catch (err) { alert("Delete failed"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isCreating ? "POST" : "PUT";
        const url = isCreating 
            ? `${apiUrl}/auth/register`
            : `${apiUrl}/logged_in/users/${editingUser.id}`;

        const payload = { ...formData };
        if (!isCreating && !payload.password) {
            delete payload.password;
        }

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
                // body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert(isCreating ? "User Created" : "User Updated");
                closeModals();
                fetchAllUsers();
            } else {
                // Log the actual error from the backend (e.g., "Username cannot be empty")
                alert(`Update failed: ${data.error}`);
            }
        } catch (err) { 
            console.error("Fetch error:", err);
            alert("Action failed: Could not connect to the server.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content user-mgmt-large-box">
                <div className="modal-header">
                    <div>
                        <h2 style={{ color: '#1e293b', marginBottom: '4px' }}>User Account Management</h2>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage system access and membership tiers.</p>
                    </div>
                    <button className="btn-update" onClick={() => setIsCreating(true)}>+ New Account</button>
                </div>

                <div className="user-table-wrapper" style={{ padding: '0 20px' }}>
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Membership</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: '600' }}>{user.username}</td>
                                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                                    <td>Tier {user.membership_type}</td>
                                    <td><span style={{ color: '#10b981' }}>● Active</span></td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="edit-icon-btn" style={{ marginRight: '10px' }} onClick={() => {setEditingUser(user); setFormData(user); setIsCreating(false);}}>✏️</button>
                                        <button className="delete-icon-btn" onClick={() => handleDelete(user.id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Close Management</button>
                </div>

                {/* REDESIGNED Sub-Modal */}
                {(isCreating || editingUser) && (
                    <div className="sub-modal-overlay">
                        <div className="modal-content professional-modal" style={{ maxWidth: '500px' }}>
                            <div className="modal-header">
                                <h3>{isCreating ? "Create New Account" : "Update Account Details"}</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div className="form-field-group">
                                        <label>Username</label>
                                        <input 
                                            className="pro-input"
                                            value={formData.username} 
                                            onChange={e => setFormData({...formData, username: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Password</label>
                                        <input 
                                            className="pro-input"
                                            type="password" 
                                            placeholder={isCreating ? "Enter password" : "Leave blank to keep current"} 
                                            onChange={e => setFormData({...formData, password: e.target.value})} 
                                            required={isCreating}
                                        />
                                    </div>
                                    <div className="form-field-group">
                                        <label>Membership Tier (0-4)</label>
                                        <input 
                                            className="pro-input"
                                            type="number" min="0" max="4" 
                                            value={formData.membership_type} 
                                            onChange={e => setFormData({...formData, membership_type: parseInt(e.target.value)})} 
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={closeModals}>Discard</button>
                                    <button type="submit" className="btn-update">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// 'use client';

// import { useState, useEffect } from "react";

// export default function UserManagement({ onClose }) {
//     const [users, setUsers] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [editingUser, setEditingUser] = useState(null);
//     const [isCreating, setIsCreating] = useState(false);

//     // Form State for Create/Update
//     const [formData, setFormData] = useState({
//         username: "",
//         password: "",
//         role: "participant",
//         membership_type: 0
//     });

//     const closeModals = () => {
//         setEditingUser(null);
//         setIsCreating(false);
//         setFormData({
//             username: "",
//             password: "",
//             role: "participant",
//             membership_type: 0
//         });
//     };

//     useEffect(() => {
//         fetchAllUsers();
//     }, []);

//     const fetchAllUsers = async () => {
//         try {
//             setIsLoading(true);
//             // Assuming an endpoint exists to list users. 
//             // If not, you'll need to add ReadAllUsers to your backend.
//             const res = await fetch("http://localhost:8080/logged_in/users", { credentials: "include" });
//             const data = await res.json();
//             if (data.users) setUsers(data.users);
//         } catch (err) {
//             console.error("Failed to fetch users", err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this account?")) return;
//         try {
//             const res = await fetch(`http://localhost:8080/logged_in/users/${id}`, {
//                 method: "DELETE",
//                 credentials: "include"
//             });
//             if (res.ok) fetchAllUsers();
//         } catch (err) { alert("Delete failed"); }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const method = isCreating ? "POST" : "PUT";
//         const url = isCreating 
//             ? "http://localhost:8080/auth/register"
//             : `http://localhost:8080/logged_in/users/${editingUser.id}`;

//         try {
//             const res = await fetch(url, {
//                 method: method,
//                 headers: { "Content-Type": "application/json" },
//                 credentials: "include",
//                 body: JSON.stringify(formData)
//             });
//             if (res.ok) {
//                 alert(isCreating ? "User Created" : "User Updated");
//                 setIsCreating(false);
//                 setEditingUser(null);
//                 fetchAllUsers();
//             }
//         } catch (err) { alert("Action failed"); }
//     };

//     return (
//         <div className="modal-overlay">
//             <div className="modal-content user-mgmt-large-box">
//                 <div className="modal-header">
//                     <h2>User Account Management</h2>
//                     <button className="glass-submit-btn" onClick={() => setIsCreating(true)}>+ New Account</button>
//                 </div>

//                 <div className="user-table-wrapper">
//                     <table className="pro-table">
//                         <thead>
//                             <tr>
//                                 <th>Username</th>
//                                 <th>Role</th>
//                                 <th>Membership</th>
//                                 <th>Activities</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map(user => (
//                                 <tr key={user.id}>
//                                     <td>{user.username}</td>
//                                     <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
//                                     <td>Type {user.membership_type}</td>
//                                     <td>{/* Activities linked via registrations */}
//                                         <button className="view-link" onClick={() => alert("Registration fetch logic here")}>View</button>
//                                     </td>
//                                     <td>
//                                         <button className="edit-icon-btn" onClick={() => {setEditingUser(user); setFormData(user); setIsCreating(false);}}>✏️</button>
//                                         <button className="delete-icon-btn" onClick={() => handleDelete(user.id)}>🗑️</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Create/Edit Sub-Modal */}
//                 {(isCreating || editingUser) && (
//                     <div className="sub-modal-overlay">
//                         <div className="modal-content professional-modal">
//                             <h3 style={{ marginBottom: '10px' }}>{isCreating ? "Create Account" : "Update Account"}</h3>
//                             <form onSubmit={handleSubmit} className="pro-form">
//                                 <div className="form-field-group">
//                                     <label>Username</label>
//                                     <input 
//                                         className="pro-input"
//                                         value={formData.username} 
//                                         onChange={e => setFormData({...formData, username: e.target.value})} 
//                                         required 
//                                     />
//                                 </div>
//                                 <div className="form-field-group">
//                                     <label>Password</label>
//                                     <input 
//                                         className="pro-input"
//                                         type="password" 
//                                         placeholder="Leave blank to keep same" 
//                                         onChange={e => setFormData({...formData, password: e.target.value})} 
//                                     />
//                                 </div>

//                                 <div className="form-field-group">
//                                     <label>Membership Type (0-4)</label>
//                                     <input 
//                                         className="pro-input"
//                                         type="number" 
//                                         min="0" 
//                                         max="4" 
//                                         value={formData.membership_type} 
//                                         onChange={e => setFormData({...formData, membership_type: parseInt(e.target.value)})} 
//                                     />
//                                 </div>

//                                 <div className="modal-actions">
//                                     <button type="button" className="btn-cancel" onClick={closeModals}>Cancel</button>
//                                     <button type="submit" className="btn-update">Save</button>
//                                 </div>
//                             </form>
//                         </div>
                        
//                     </div>
//                 )}
                
//                 <div className="modal-footer">
//                     <button className="cancel-btn" onClick={onClose}>Close Management</button>
//                 </div>
//             </div>
//         </div>
//     );
// }