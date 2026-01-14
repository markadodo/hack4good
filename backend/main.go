package main

import (
	"github.com/gin-gonic/gin"

	"log"

	"fmt"

	"backend/database"
	"backend/handlers"
	"backend/middleware"
	"context"
	"database/sql"

	_ "github.com/lib/pq"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

func main() {
	ctx := context.Background()

	pgContainer, err := postgres.Run(ctx,
		"postgres:16-alpine",
		postgres.WithDatabase("testdb"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2),
		),
	)

	connStr, err := pgContainer.ConnectionString(ctx, "sslmode=disable")

	db, err := sql.Open("postgres", connStr)

	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()
	//Initialize schema (Tables: users, activities, registrations)
	fmt.Println("db working")

	err = database.InitDB(db)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("db created")
	//router initialization
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	//public routes
	r.POST("/login", handlers.LoginHandler(db))
	r.POST("/users", handlers.CreateUserHandler(db)) // Public registration

	// Public Post Viewing
	r.GET("/posts", handlers.ReadPostHandler(db))
	r.GET("/topics/:topic_id/posts", handlers.ReadPostByTopicIDHandler(db))
	r.GET("/topics/:topic_id/posts/search", handlers.ReadPostBySearchQueryHandler(db))

	// 5. PROTECTED ROUTES (Requires JWT Token)
	authGroup := r.Group("/logged_in")
	authGroup.Use(middleware.JWTAuthorisation()) //
	{
		// Admin Subgroup (Activities & User Management)
		admin := authGroup.Group("/admin")
		{
			// Activities CRUD for Admin Calendar
			admin.GET("/activities", handlers.GetActivitiesHandler(db))
			admin.POST("/activities", handlers.CreateActivityHandler(db))

			// Account Management
			admin.GET("/users", handlers.ReadAllUsersHandler(db))
			admin.DELETE("/users/:user_id", handlers.DeleteUserByIDHandler(db)) //
		}

		// Participant/Volunteer Subgroup
		authGroup.GET("/user/profile", handlers.ReadUserByIDHandler(db)) //
	}
	r.Run(":8080")

	// test := gin.Default()

	// test.POST("/login", handlers.LoginHandler(db))
	// test.GET("/topics/:topic_id/posts", handlers.ReadPostByTopicIDHandler(db))
	// test.POST("/users", handlers.CreateUserHandler(db))
	// test.GET("/topics/:topic_id/posts/search", handlers.ReadPostBySearchQueryHandler(db))
	// test.GET("/posts", handlers.ReadPostHandler(db))

	// r := test.Group("/logged_in")

	// r.Use(middleware.JWTAuthorisation())
	// {
	// }

	//test.Run(":8080")
}
