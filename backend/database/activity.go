package database

import (
	"backend/models"
	"database/sql"
	"time"
)

func CreateActivity(db *sql.DB, activity *models.Activity) error {
	// Set the creation timestamp
	activity.CreatedAt = time.Now()

	query := `
    INSERT INTO activities (
        title, description, location, meetup_location, 
        start_time, end_time, wheelchair_access, 
        payment_required, participant_vacancy, 
        volunteer_vacancy, created_by, created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id;
    `

	// Execute and scan the new ID back into the struct
	err := db.QueryRow(
		query,
		activity.Title,
		activity.Description,
		activity.Location,
		activity.MeetupLocation, // pq driver handles Go slices to Postgres arrays
		activity.StartTime,
		activity.EndTime,
		activity.WheelchairAccess,
		activity.PaymentRequired,
		activity.ParticipantVacancy,
		activity.VolunteerVacancy,
		activity.CreatedBy,
		activity.CreatedAt,
	).Scan(&activity.ID)

	return err
}
