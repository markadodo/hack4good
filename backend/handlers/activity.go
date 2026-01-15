package handlers

import (
	"backend/database"
	"backend/models"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateActivityHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var activity models.Activity

		// Bind JSON from request body to the Activity struct
		if err := c.ShouldBindJSON(&activity); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
			return
		}

		// Retrieve the user_id of the admin from the JWT middleware
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		activity.CreatedBy = userID.(int64)

		// Call the database function to save
		if err := database.CreateActivity(db, &activity); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save activity"})
			return
		}

		c.JSON(http.StatusCreated, activity)
	}
}
