package handlers

import (
	"backend/database"
	"backend/models"
	"database/sql"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateActivityHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input models.CreateActivityInput

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		if input.Title == "" {
			c.JSON(400, gin.H{"error": "Title cannot be empty"})
			return
		}
		if input.Description == "" {
			c.JSON(400, gin.H{"error": "Description cannot be empty"})
			return
		}
		if input.Location == "" {
			c.JSON(400, gin.H{"error": "Location cannot be empty"})
			return
		}
		if len(input.MeetupLocation) == 0 {
			c.JSON(400, gin.H{"error": "Meetup location cannot be empty"})
			return
		}
		if input.StartTime.IsZero() {
			c.JSON(400, gin.H{"error": "Start time cannot be empty"})
			return
		}
		if input.EndTime.IsZero() {
			c.JSON(400, gin.H{"error": "End time cannot be empty"})
			return
		}
		if input.StartTime.After(input.EndTime) {
			c.JSON(400, gin.H{"error": "Start time must be before end time"})
			return
		}
		if input.EndTime.Before(time.Now()) {
			c.JSON(400, gin.H{"error": "End time cannot be in the past"})
			return
		}
		if input.ParticipantVacancy < 0 {
			c.JSON(400, gin.H{"error": "Participant vacancy cannot be negative"})
			return
		}

		if input.VolunteerVacancy < 0 {
			c.JSON(400, gin.H{"error": "Volunteer vacancy cannot be negative"})
			return
		}
		if input.CreatedBy <= 0 {
			c.JSON(400, gin.H{"error": "Invalid creator ID"})
			return
		}

		if err := database.CreateActivity(db, &input); err != nil {
			c.JSON(500, gin.H{"error": "Could not create activity"})
			return
		}

		c.JSON(201, gin.H{"status": "Activity created successfully"})
	}
}

func ReadActivityByIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		strid := c.Param("activity_id")
		id, err := strconv.ParseInt(strid, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		activity, err := database.ReadActivityByID(db, id)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if activity == nil {
			c.JSON(404, gin.H{"error": "Activity not found"})
			return
		}

		c.JSON(200, gin.H{
			"id":                  activity.ID,
			"title":               activity.Title,
			"description":         activity.Description,
			"location":            activity.Location,
			"meetup_location":     activity.MeetupLocation,
			"start_time":          activity.StartTime,
			"end_time":            activity.EndTime,
			"wheelchair_access":   activity.WheelchairAccess,
			"payment_required":    activity.PaymentRequired,
			"participant_vacancy": activity.ParticipantVacancy,
			"volunteer_vacancy":   activity.VolunteerVacancy,
			"created_by":          activity.CreatedBy,
			"created_at":          activity.CreatedAt,
		})
	}
}

func UpdateActivityByIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		strid := c.Param("activity_id")
		id, err := strconv.ParseInt(strid, 10, 64)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		var input models.UpdateActivityInput

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		if input.Title != nil && *input.Title == "" {
			c.JSON(400, gin.H{"error": "Title cannot be empty"})
			return
		}
		if input.Description != nil && *input.Description == "" {
			c.JSON(400, gin.H{"error": "Description cannot be empty"})
			return
		}
		if input.Location != nil && *input.Location == "" {
			c.JSON(400, gin.H{"error": "Location cannot be empty"})
			return
		}
		if input.MeetupLocation != nil && len(*input.MeetupLocation) == 0 {
			c.JSON(400, gin.H{"error": "Meetup location cannot be empty"})
			return
		}
		if input.StartTime != nil && input.StartTime.IsZero() {
			c.JSON(400, gin.H{"error": "Start time cannot be empty"})
			return
		}
		if input.EndTime != nil && input.EndTime.IsZero() {
			c.JSON(400, gin.H{"error": "End time cannot be empty"})
			return
		}
		if input.StartTime != nil && input.EndTime != nil && input.StartTime.After(*input.EndTime) {
			c.JSON(400, gin.H{"error": "Start time must be before end time"})
			return
		}
		if input.EndTime != nil && input.EndTime.Before(time.Now()) {
			c.JSON(400, gin.H{"error": "End time cannot be in the past"})
			return
		}
		if input.ParticipantVacancy != nil && *input.ParticipantVacancy < 0 {
			c.JSON(400, gin.H{"error": "Participant vacancy cannot be negative"})
			return
		}
		if input.VolunteerVacancy != nil && *input.VolunteerVacancy < 0 {
			c.JSON(400, gin.H{"error": "Volunteer vacancy cannot be negative"})
			return
		}

		empty_update, activity_not_found, err := database.UpdateActivityByID(db, id, &input)

		if err != nil {
			c.JSON(500, gin.H{"error": "Could not update activity"})
			return
		}

		if empty_update {
			c.JSON(400, gin.H{"error": "Empty update"})
			return
		}

		if activity_not_found {
			c.JSON(404, gin.H{"error": "Activity not found"})
			return
		}

		c.JSON(200, gin.H{"status": "Activity updated successfully"})
	}
}

func DeleteActivityByIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		strid := c.Param("activity_id")
		id, err := strconv.ParseInt(strid, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		activity_not_found, err := database.DeleteActivityByID(db, id)

		if err != nil {
			c.JSON(500, gin.H{"error": "Could not delete activity"})
			return
		}

		if activity_not_found {
			c.JSON(404, gin.H{"error": "Activity not found"})
			return
		}

		c.JSON(200, gin.H{"status": "Activity deleted successfully"})
	}
}

func ReadActivityHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		pageStr := c.DefaultQuery("page", "1")
		limitStr := c.DefaultQuery("limit", "10")

		page, err := strconv.Atoi(pageStr)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid page"})
			return
		}

		limit, err := strconv.Atoi(limitStr)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid limit"})
			return
		}

		if page <= 0 {
			page = 1
		}

		if limit < 10 || limit >= 100 {
			limit = 10
		}

		offset := (page - 1) * limit

		sortBy := c.DefaultQuery("sort_by", "created_at")
		order := c.DefaultQuery("order", "DESC")

		if sortBy != "created_at" && sortBy != "start_time" {
			sortBy = "created_at"
		}

		if order != "ASC" && order != "DESC" {
			order = "DESC"
		}

		activitiesData, err := database.ReadActivity(db, limit, offset, sortBy, order)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if len(activitiesData) == 0 {
			c.JSON(200, gin.H{
				"count":      0,
				"page":       page,
				"limit":      limit,
				"sort_by":    sortBy,
				"order":      order,
				"activities": []models.Activity{},
			})
			return
		}

		c.JSON(200, gin.H{
			"count":      len(activitiesData),
			"page":       page,
			"limit":      limit,
			"sort_by":    sortBy,
			"order":      order,
			"activities": activitiesData,
		})
	}
}

func GetActivityOwnerHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		strid := c.Param("activity_id")
		id, err := strconv.ParseInt(strid, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		ownerID, err := database.GetActivityOwnerByID(db, id)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if ownerID == 0 {
			c.JSON(404, gin.H{"error": "Activity not found"})
			return
		}

		c.JSON(200, gin.H{"owner_id": ownerID})
	}
}
