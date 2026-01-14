package handlers

import (
	"backend/database"
	"backend/models"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetActivitiesHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		acts, err := database.ReadAllActivities(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, acts)
	}
}

func CreateActivityHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input models.CreateActivityInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// Convert input to model and call database.CreateActivity...
	}
}
