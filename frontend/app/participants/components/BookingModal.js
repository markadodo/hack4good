import { useState } from "react";

export default function BookingModal({ activity, bookedDates, onClose, onConfirm }) {
    const [selectedDate, setSelectedDate] = useState("");

    const handleConfirm = () => {
        if (!selectedDate) {
            alert("Please select a date");
            return;
        }

        const day = new Date(selectedDate).getDate();

        if (bookedDates.includes(day)) {
            alert("You already have an activity on this date. Please select another date.");
            return;
        }

        onConfirm(day); // Add day to bookedDates in parent
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Register: {activity.name}</h2>
                <p>Select a date for your activity:</p>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-picker"
                />

                <div className="modal-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn confirm" onClick={handleConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}