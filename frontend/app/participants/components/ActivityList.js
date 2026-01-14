import { useRef } from "react";

const activities = [
    { id: 1, name: "Cooking Skills" },
    { id: 2, name: "Art Therapy" },
    { id: 3, name: "Community Outing" },
    { id: 4, name: "Music Therapy" },
    { id: 5, name: "Sports & Games" },
];

export default function ActivityList({ onRegister }) {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    return (
        <div className="activity-panel">
            <h1 className="dashboard-title">Participant Dashboard</h1>
            <h3>Select Activity</h3>
            <div className="slider-wrapper">
                <button className="slider-btn left" onClick={scrollLeft}>
                    &#8249;
                </button>

                <div className="slider" ref={sliderRef}>
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="activity-card-slider"
                            onClick={() => onRegister(activity)}
                        >
                            {activity.name}
                        </div>
                    ))}
                </div>

                <button className="slider-btn right" onClick={scrollRight}>
                    &#8250;
                </button>
            </div>
        </div>
    );
}