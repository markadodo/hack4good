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

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile saved!");
  };

  const toggleFavorite = (eventId) => {
    setProfile((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(eventId)
        ? prev.favorites.filter((id) => id !== eventId)
        : [...prev.favorites, eventId],
    }));
  };

  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="event-card">
        <h2>Personal Information</h2>
        <label>Name:</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          aria-label="Enter your name"
        />
        <label>Email:</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          aria-label="Enter your email"
        />
        <label>Membership Type:</label>
        <select
          value={profile.membership}
          onChange={(e) => setProfile({ ...profile, membership: e.target.value })}
          aria-label="Select membership type"
        >
          <option value="ad hoc">Ad Hoc</option>
          <option value="once a week">Once a Week</option>
          <option value="twice a week">Twice a Week</option>
          <option value="3+ times a week">3+ Times a Week</option>
        </select>
        <button onClick={saveProfile}>Save Profile</button>
      </div>

      <div className="event-card">
        <h2>Event History</h2>
        <p>Attended events: {profile.history.length}</p>
        {/* Simulate history */}
      </div>

      <div className="event-card">
        <h2>Favorite Events</h2>
        <p>Favorites: {profile.favorites.length}</p>
        {/* List favorites */}
      </div>
    </div>
  );
}