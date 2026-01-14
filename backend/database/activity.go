package database

import (
	"backend/models"
	"database/sql"
	"time"
)

func CreateActivity(db *sql.DB, act *models.Activity) error {
	act.CreatedAt = time.Now()
	query := `INSERT INTO activities (title, description, location, meetup_location, start_time, end_time, participant_vacancy, volunteer_vacancy, created_by, created_at) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`
	return db.QueryRow(query, act.Title, act.Description, act.Location, act.MeetupLocation, act.StartTime, act.EndTime, act.ParticipantVacancy, act.VolunteerVacancy, act.CreatedBy, act.CreatedAt).Scan(&act.ID)
}

func ReadAllActivities(db *sql.DB) ([]models.Activity, error) {
	query := `SELECT id, title, description, location, participant_vacancy, volunteer_vacancy, start_time FROM activities`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []models.Activity
	for rows.Next() {
		var a models.Activity
		if err := rows.Scan(&a.ID, &a.Title, &a.Description, &a.Location, &a.ParticipantVacancy, &a.VolunteerVacancy, &a.StartTime); err != nil {
			return nil, err
		}
		activities = append(activities, a)
	}
	return activities, nil
}
