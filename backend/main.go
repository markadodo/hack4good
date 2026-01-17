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

	routes := router.Group("/")

	routes.Use(middleware.EnableCORS())

	routes.OPTIONS("/*path")

	// Public Routes
	// Authentication
	routes.POST("/auth/login", handlers.LoginHandler(db))
	routes.POST("/auth/register", handlers.CreateUserHandler(db))

	// Activities - Read Only
	routes.GET("/activities", handlers.ReadActivityHandler(db))
	routes.GET("/activities/:activity_id", handlers.ReadActivityByIDHandler(db))

	// Protected Routes (Require Authentication)
	protected := routes.Group("/logged_in")
	protected.Use(middleware.JWTAuthorisation())
	{
		//user management
		protected.GET("/users", handlers.ReadAllUsersHandler(db))

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

		//protected.GET("/users/:user_id", handlers.ReadUserByIDHandler(db))
	}

	router.Run(":8080")
}
