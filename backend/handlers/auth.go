package handlers

import (
	"database/sql"

	"github.com/gin-gonic/gin"

	"backend/auth"
	"backend/database"
	"backend/models"
)

func LoginHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		var loginData models.LoginUserData

		if err := c.ShouldBindJSON(&loginData); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		userData, err := database.ReadUserByUsername(db, loginData.Username)

		if err != nil {
			c.JSON(500, gin.H{"error": "Internal server error"})
			return
		}

		if userData == nil {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		}

		userID, role, err := auth.CheckLoginValidity(userData, &loginData)

		if err != nil {
			c.JSON(400, gin.H{"error": "Password wrong"})
			return
		}

		tokenStr, err := auth.GenerateJWT(userID, role)

		if err != nil {
			c.JSON(500, gin.H{"error": "Could not generate token"})
			return
		}

		// var current_status bool = false

		// if status := os.Getenv("STATUS"); status == "deployment" {
		// 	current_status = true
		// }

		c.SetCookie(
			"token",
			tokenStr,
			3600,
			"/",
			"",
			false,
			true,
		)

		c.JSON(200, gin.H{"user_id": userID, "role": role}) //added role
	}
}
