package main

import (
	"github.com/gin-gonic/gin"

	"log"

	"fmt"

	"backend/database"
	"backend/handlers"
	"backend/middleware"

	_ "github.com/lib/pq"
)

func main() {
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	log.Println("Connected to Postgres")

	err = database.InitDB(db)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("DB created")

	router := gin.Default()

	//Newly added:
	// In backend/main.go, add a simple CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	//return back to original code

	// Public Routes
	// Authentication
	router.POST("/auth/login", handlers.LoginHandler(db))
	router.POST("/auth/register", handlers.CreateUserHandler(db))

	// Activities - Read Only
	router.GET("/activities", handlers.ReadActivityHandler(db))
	router.GET("/activities/:activity_id", handlers.ReadActivityByIDHandler(db))

	// Protected Routes (Require Authentication)
	protected := router.Group("/logged_in")
	protected.Use(middleware.JWTAuthorisation())
	{
		// User Routes
		protected.GET("/users/:user_id", handlers.ReadUserByIDHandler(db))
		protected.PUT("/users/:user_id", handlers.UpdateUserByIDHandler(db))
		protected.DELETE("/users/:user_id", handlers.DeleteUserByIDHandler(db))

		// Activity Management Routes
		protected.POST("/activities", handlers.CreateActivityHandler(db))
		protected.PUT("/activities/:activity_id", handlers.UpdateActivityByIDHandler(db))
		protected.DELETE("/activities/:activity_id", handlers.DeleteActivityByIDHandler(db))
		protected.GET("/activities/:activity_id/owner", handlers.GetActivityOwnerHandler(db))
		protected.GET("/activities/:activity_id/registrations/count", handlers.GetRegistrationCountByActivityIDHandler(db))

		// Registration Routes
		protected.POST("/registrations", handlers.CreateRegistrationHandler(db))
		protected.GET("/registrations/:registration_id", handlers.ReadRegistrationByIDHandler(db))
		protected.PUT("/registrations/:registration_id", handlers.UpdateRegistrationByIDHandler(db))
		protected.DELETE("/registrations/:registration_id", handlers.DeleteRegistrationByIDHandler(db))

		// User Registrations
		protected.GET("/users/:user_id/registrations", handlers.ReadRegistrationsByUserIDHandler(db))
		protected.GET("/users/:user_id/activities/:activity_id/registration", handlers.ReadRegistrationByUserIDAndActivityIDHandler(db))
		protected.DELETE("/users/:user_id/activities/:activity_id/registration", handlers.DeleteRegistrationByUserIDAndActivityIDHandler(db))

		// Activity Registrations
		protected.GET("/activities/:activity_id/registrations", handlers.ReadRegistrationsByActivityIDHandler(db))
	}

	router.Run(":8080")
}
