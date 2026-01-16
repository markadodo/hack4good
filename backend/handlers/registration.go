package handlers

import (
	"backend/database"
	"backend/models"
	"database/sql"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateRegistrationHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input models.CreateRegistrationInput

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		if input.UserID <= 0 {
			c.JSON(400, gin.H{"error": "Invalid user ID"})
			return
		}
		if input.ActivityID <= 0 {
			c.JSON(400, gin.H{"error": "Invalid activity ID"})
			return
		}
		if input.MeetupLocation == "" {
			c.JSON(400, gin.H{"error": "Meetup location cannot be empty"})
			return
		}

		if err := database.CreateRegistration(db, &input); err != nil {
			c.JSON(500, gin.H{"error": "Could not create registration"})
			return
		}

		c.JSON(201, gin.H{"status": "Registration created successfully"})
	}
}

func ReadRegistrationByIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		strid := c.Param("registration_id")
		id, err := strconv.ParseInt(strid, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		registration, err := database.ReadRegistrationByID(db, id)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if registration == nil {
			c.JSON(404, gin.H{"error": "Registration not found"})
			return
		}

		c.JSON(200, gin.H{
			"id":              registration.ID,
			"user_id":         registration.UserID,
			"activity_id":     registration.ActivityID,
			"meetup_location": registration.MeetupLocation,
			"registered_at":   registration.RegisteredAt,
		})
	}
}

func ReadRegistrationByUserIDAndActivityIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDStr := c.Param("user_id")
		activityIDStr := c.Param("activity_id")

		userID, err := strconv.ParseInt(userIDStr, 10, 64)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid user ID"})
			return
		}

		activityID, err := strconv.ParseInt(activityIDStr, 10, 64)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid activity ID"})
			return
		}

		registration, err := database.ReadRegistrationByUserIDAndActivityID(db, userID, activityID)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if registration == nil {
			c.JSON(404, gin.H{"error": "Registration not found"})
			return
		}

		c.JSON(200, gin.H{
			"id":              registration.ID,
			"user_id":         registration.UserID,
			"activity_id":     registration.ActivityID,
			"meetup_location": registration.MeetupLocation,
			"registered_at":   registration.RegisteredAt,
		})
	}
}

func ReadRegistrationsByUserIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDStr := c.Param("user_id")
		userID, err := strconv.ParseInt(userIDStr, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid user ID"})
			return
		}

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

		registrations, err := database.ReadRegistrationsByUserID(db, userID, limit, offset)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if len(registrations) == 0 {
			c.JSON(200, gin.H{
				"count":         0,
				"page":          page,
				"limit":         limit,
				"registrations": []models.Registration{},
			})
			return
		}

		c.JSON(200, gin.H{
			"count":         len(registrations),
			"page":          page,
			"limit":         limit,
			"registrations": registrations,
		})
	}
}

func ReadRegistrationsByActivityIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		activityIDStr := c.Param("activity_id")
		activityID, err := strconv.ParseInt(activityIDStr, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid activity ID"})
			return
		}

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

		registrations, err := database.ReadRegistrationsByActivityID(db, activityID, limit, offset)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if len(registrations) == 0 {
			c.JSON(200, gin.H{
				"count":         0,
				"page":          page,
				"limit":         limit,
				"registrations": []models.Registration{},
			})
			return
		}

		c.JSON(200, gin.H{
			"count":         len(registrations),
			"page":          page,
			"limit":         limit,
			"registrations": registrations,
		})
	}
}

func UpdateRegistrationByIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		strid := c.Param("registration_id")
		id, err := strconv.ParseInt(strid, 10, 64)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		var input models.UpdateRegistrationInput

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		if input.MeetupLocation != nil && *input.MeetupLocation == "" {
			c.JSON(400, gin.H{"error": "Meetup location cannot be empty"})
			return
		}

		empty_update, registration_not_found, err := database.UpdateRegistrationByID(db, id, &input)

		if err != nil {
			c.JSON(500, gin.H{"error": "Could not update registration"})
			return
		}

		if empty_update {
			c.JSON(400, gin.H{"error": "Empty update"})
			return
		}

		if registration_not_found {
			c.JSON(404, gin.H{"error": "Registration not found"})
			return
		}

		c.JSON(200, gin.H{"status": "Registration updated successfully"})
	}
}

func DeleteRegistrationByIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		strid := c.Param("registration_id")
		id, err := strconv.ParseInt(strid, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid ID"})
			return
		}

		registration_not_found, err := database.DeleteRegistrationByID(db, id)

		if err != nil {
			c.JSON(500, gin.H{"error": "Could not delete registration"})
			return
		}

		if registration_not_found {
			c.JSON(404, gin.H{"error": "Registration not found"})
			return
		}

		c.JSON(200, gin.H{"status": "Registration deleted successfully"})
	}
}

func DeleteRegistrationByUserIDAndActivityIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDStr := c.Param("user_id")
		activityIDStr := c.Param("activity_id")

		userID, err := strconv.ParseInt(userIDStr, 10, 64)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid user ID"})
			return
		}

		activityID, err := strconv.ParseInt(activityIDStr, 10, 64)
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid activity ID"})
			return
		}

		registration_not_found, err := database.DeleteRegistrationByUserIDAndActivityID(db, userID, activityID)

		if err != nil {
			c.JSON(500, gin.H{"error": "Could not delete registration"})
			return
		}

		if registration_not_found {
			c.JSON(404, gin.H{"error": "Registration not found"})
			return
		}

		c.JSON(200, gin.H{"status": "Registration deleted successfully"})
	}
}

func GetRegistrationCountByActivityIDHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		activityIDStr := c.Param("activity_id")
		activityID, err := strconv.ParseInt(activityIDStr, 10, 64)

		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid activity ID"})
			return
		}

		count, err := database.GetRegistrationCountByActivityID(db, activityID)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		c.JSON(200, gin.H{"count": count})
	}
}
