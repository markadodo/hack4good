package models

import "time"

type Registration struct {
	ID             int64     `json:"id"`
	UserID         int64     `json:"user_id"`
	ActivityID     int64     `json:"activity_id"`
	MeetupLocation string    `json:"meetup_location"`
	RegisteredAt   time.Time `json:"registered_at"`
}

type CreateRegistrationInput struct {
	UserID         int64  `json:"user_id" binding:"required"`
	ActivityID     int64  `json:"activity_id" binding:"required"`
	MeetupLocation string `json:"meetup_location" binding:"required"`
}

type UpdateRegistrationInput struct {
	MeetupLocation *string `json:"meetup_location"`
}
