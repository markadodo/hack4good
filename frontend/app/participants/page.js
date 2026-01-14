"use client";

import { useState } from "react";
import ActivityList from "./components/ActivityList";
import CalendarView from "./components/CalendarView";
import BookingModal from "./components/BookingModal";

export default function ParticipantsPage() {
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleBook = (date) => {
        if (bookedDates.includes(date)) {
            alert("You already have an activity on this date.");
            return;
        }
        setBookedDates([...bookedDates, date]);
        setSelectedActivity(null);
    };

    return (
        <div className="dashboard">

            <div className="left-panel">
                <ActivityList onRegister={setSelectedActivity} />
            </div>

            <div className="right-panel">
                <CalendarView
                    bookedDates={bookedDates}
                    onCancelBooking={(day) => {
                        setBookedDates(bookedDates.filter(d => d !== day));
                    }}
                />
            </div>

            {selectedActivity && (
                <BookingModal
                    activity={selectedActivity}
                    bookedDates={bookedDates}       // Pass booked dates
                    onClose={() => setSelectedActivity(null)}
                    onConfirm={(day) => {
                        setBookedDates([...bookedDates, day]);
                        setSelectedActivity(null);
                    }}
                />
            )}
        </div>
    );
}