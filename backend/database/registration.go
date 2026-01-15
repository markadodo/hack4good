package database

import (
	"backend/models"
	"database/sql"
	"strconv"
	"strings"
	"time"
)

func CreateRegistration(db *sql.DB, input *models.CreateRegistrationInput) error {
	registeredAt := time.Now()

	query := `
	INSERT INTO registrations (
		user_id,
		activity_id,
		meetup_location,
		registered_at
	)
	VALUES ($1, $2, $3, $4);
	`
	_, err := db.Exec(
		query,
		input.UserID,
		input.ActivityID,
		input.MeetupLocation,
		registeredAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func ReadRegistrationByID(db *sql.DB, id int64) (*models.Registration, error) {
	registration := models.Registration{}

	query := `
	SELECT id, user_id, activity_id, meetup_location, registered_at
	FROM registrations
	WHERE id = $1
	`
	err := db.QueryRow(query, id).Scan(&registration.ID, &registration.UserID, &registration.ActivityID, &registration.MeetupLocation, &registration.RegisteredAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &registration, nil
}

func ReadRegistrationByUserIDAndActivityID(db *sql.DB, userID int64, activityID int64) (*models.Registration, error) {
	registration := models.Registration{}

	query := `
	SELECT id, user_id, activity_id, meetup_location, registered_at
	FROM registrations
	WHERE user_id = $1 AND activity_id = $2
	`
	err := db.QueryRow(query, userID, activityID).Scan(&registration.ID, &registration.UserID, &registration.ActivityID, &registration.MeetupLocation, &registration.RegisteredAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &registration, nil
}

func ReadRegistrationsByUserID(db *sql.DB, userID int64, limit int, offset int) ([]models.Registration, error) {
	var registrations []models.Registration

	query := `
	SELECT id, user_id, activity_id, meetup_location, registered_at
	FROM registrations
	WHERE user_id = $1
	ORDER BY registered_at DESC
	LIMIT $2 OFFSET $3
	`

	rows, err := db.Query(query, userID, limit, offset)

	if err != nil {
		return registrations, err
	}

	defer rows.Close()

	for rows.Next() {
		var registration models.Registration

		if err := rows.Scan(&registration.ID, &registration.UserID, &registration.ActivityID, &registration.MeetupLocation, &registration.RegisteredAt); err != nil {
			return registrations, err
		}

		registrations = append(registrations, registration)
	}

	if err := rows.Err(); err != nil {
		return registrations, err
	}

	return registrations, nil
}

func ReadRegistrationsByActivityID(db *sql.DB, activityID int64, limit int, offset int) ([]models.Registration, error) {
	var registrations []models.Registration

	query := `
	SELECT id, user_id, activity_id, meetup_location, registered_at
	FROM registrations
	WHERE activity_id = $1
	ORDER BY registered_at DESC
	LIMIT $2 OFFSET $3
	`

	rows, err := db.Query(query, activityID, limit, offset)

	if err != nil {
		return registrations, err
	}

	defer rows.Close()

	for rows.Next() {
		var registration models.Registration

		if err := rows.Scan(&registration.ID, &registration.UserID, &registration.ActivityID, &registration.MeetupLocation, &registration.RegisteredAt); err != nil {
			return registrations, err
		}

		registrations = append(registrations, registration)
	}

	if err := rows.Err(); err != nil {
		return registrations, err
	}

	return registrations, nil
}

func UpdateRegistrationByID(db *sql.DB, id int64, input *models.UpdateRegistrationInput) (bool, bool, error) {
	updates := []string{}
	args := []interface{}{}
	counter := 1

	if input.MeetupLocation != nil {
		updates = append(updates, "meetup_location = $"+strconv.Itoa(counter))
		args = append(args, *input.MeetupLocation)
		counter += 1
	}

	if len(updates) == 0 {
		return true, false, nil
	}

	query := "UPDATE registrations SET " + strings.Join(updates, ", ") + " WHERE id = $" + strconv.Itoa(counter)
	args = append(args, id)
	res, err := db.Exec(query, args...)

	if err != nil {
		return false, false, err
	}

	if count, _ := res.RowsAffected(); count == 0 {
		return false, true, nil
	}

	return false, false, nil
}

func DeleteRegistrationByID(db *sql.DB, id int64) (bool, error) {
	query := "DELETE FROM registrations WHERE id = $1"
	res, err := db.Exec(query, id)

	if err != nil {
		return false, err
	}

	if count, _ := res.RowsAffected(); count == 0 {
		return true, nil
	}

	return false, nil
}

func DeleteRegistrationByUserIDAndActivityID(db *sql.DB, userID int64, activityID int64) (bool, error) {
	query := "DELETE FROM registrations WHERE user_id = $1 AND activity_id = $2"
	res, err := db.Exec(query, userID, activityID)

	if err != nil {
		return false, err
	}

	if count, _ := res.RowsAffected(); count == 0 {
		return true, nil
	}

	return false, nil
}

func GetRegistrationCountByActivityID(db *sql.DB, activityID int64) (int, error) {
	var count int

	query := `
	SELECT COUNT(*) FROM registrations
	WHERE activity_id = $1
	`

	err := db.QueryRow(query, activityID).Scan(&count)

	if err != nil {
		return 0, err
	}

	return count, nil
}
