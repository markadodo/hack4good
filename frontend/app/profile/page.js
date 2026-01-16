'use client';

import { useState, useEffect } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    membership: "ad hoc",
    history: [],
    favorites: [],
  });

  // State to track if the form is in "Edit Mode"
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setIsEditing(false); // Lock the fields after saving
    alert("Profile saved successfully!");
  };

  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="event-card profile-card">
        <div className="profile-header">
          <h2>Personal Information</h2>
          {/* Yellow Edit Button */}
          {!isEditing && (
            <button className="edit-btn-yellow" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <label>Name:</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          disabled={!isEditing} // Disables input if NOT editing
          className={!isEditing ? "read-only-input" : ""}
        />

        <label>Email:</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          disabled={!isEditing} // Disables input if NOT editing
          className={!isEditing ? "read-only-input" : ""}
        />

        <label>Membership Type:</label>
        <select
          value={profile.membership}
          onChange={(e) => setProfile({ ...profile, membership: e.target.value })}
          disabled={!isEditing} // Disables input if NOT editing
          className={!isEditing ? "read-only-input" : ""}
        >
          <option value="ad hoc">Ad Hoc</option>
          <option value="once a week">Once a Week</option>
          <option value="twice a week">Twice a Week</option>
          <option value="3+ times a week">3+ Times a Week</option>
        </select>

        {/* Save button only appears when in Edit Mode */}
        {isEditing && (
          <button className="save-btn" onClick={saveProfile} style={{ marginTop: "20px", width: "100%" }}>
            Save Profile
          </button>
        )}
      </div>

      <div className="event-card">
        <h2>Event History</h2>
        <p>Attended events: {profile.history.length}</p>
      </div>

      <div className="event-card">
        <h2>Favorite Events</h2>
        <p>Favorites: {profile.favorites.length}</p>
      </div>
    </div>
  );
}