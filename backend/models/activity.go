package models

import "time"

type Activity struct {
	ID                 int64     `json:"id"`
	Title              string    `json:"title"`
	Description        string    `json:"description"`
	Location           string    `json:"location"`
	MeetupLocation     []string  `json:"meetup_location"`
	StartTime          time.Time `json:"start_time"`
	EndTime            time.Time `json:"end_time"`
	WheelchairAccess   bool      `json:"wheelchair_access"`
	PaymentRequired    bool      `json:"payment_required"`
	ParticipantVacancy int       `json:"participant_vacancy"`
	VolunteerVacancy   int       `json:"volunteer_vacancy"`
	CreatedBy          int64     `json:"created_by"`
	CreatedAt          time.Time `json:"created_at"`
}

type CreateActivityInput struct {
	Title              string    `json:"title" binding:"required"`
	Description        string    `json:"description" binding:"required"`
	Location           string    `json:"location" binding:"required"`
	MeetupLocation     []string  `json:"meetup_location" binding:"required"`
	StartTime          time.Time `json:"start_time" binding:"required"`
	EndTime            time.Time `json:"end_time" binding:"required"`
	WheelchairAccess   bool      `json:"wheelchair_access"`
	PaymentRequired    bool      `json:"payment_required"`
	ParticipantVacancy int       `json:"participant_vacancy" binding:"required"`
	VolunteerVacancy   int       `json:"volunteer_vacancy" binding:"required"`
	CreatedBy          int64     `json:"created_by" binding:"required"`
}

type UpdateActivityInput struct {
	Title              *string    `json:"title"`
	Description        *string    `json:"description"`
	Location           *string    `json:"location"`
	MeetupLocation     *[]string  `json:"meetup_location"`
	StartTime          *time.Time `json:"start_time"`
	EndTime            *time.Time `json:"end_time"`
	WheelchairAccess   *bool      `json:"wheelchair_access"`
	PaymentRequired    *bool      `json:"payment_required"`
	ParticipantVacancy *int       `json:"participant_vacancy"`
	VolunteerVacancy   *int       `json:"volunteer_vacancy"`
}
