import { useState, useEffect } from "react";

export default function CalendarView({ bookedDates, onCancelBooking }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [cancelDate, setCancelDate] = useState(null);

    // First day of month
    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    // Total days in month
    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    // Generate calendar grid
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

    // Month navigation
    const prevMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    const nextMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    // Handle click on a booked date
    const handleBoxClick = (day) => {
        if (bookedDates.includes(day)) {
            setCancelDate(day); // show cancel modal
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={prevMonth}>&lt;</button>
                <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
                <button onClick={nextMonth}>&gt;</button>
            </div>

            <div className="calendar-grid">
                {dayNames.map((day) => (
                    <div key={day} className="calendar-day-name">{day}</div>
                ))}

                {calendarDays.map((day, idx) => (
                    <div
                        key={idx}
                        className={`calendar-day-box ${
                            bookedDates.includes(day) ? "booked" : ""
                        } ${day === null ? "empty" : ""}`}
                        onClick={() => day && bookedDates.includes(day) && handleBoxClick(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Cancel Booking Modal */}
            {cancelDate && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h2>Cancel Booking?</h2>
                        <p>Do you want to cancel your booking on day {cancelDate}?</p>
                        <div className="modal-actions">
                            <button
                                className="btn cancel"
                                onClick={() => setCancelDate(null)}
                            >
                                Keep
                            </button>
                            <button
                                className="btn confirm"
                                onClick={() => {
                                    onCancelBooking(cancelDate);
                                    setCancelDate(null);
                                }}
                            >
                                Cancel Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}