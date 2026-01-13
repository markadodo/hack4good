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

	fmt.Println("db working")

	err = database.InitDB(db)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("db created")

	test := gin.Default()

	test.POST("/login", handlers.LoginHandler(db))
	test.GET("/topics/:topic_id/posts", handlers.ReadPostByTopicIDHandler(db))
	test.POST("/users", handlers.CreateUserHandler(db))
	test.GET("/topics/:topic_id/posts/search", handlers.ReadPostBySearchQueryHandler(db))
	test.GET("/posts", handlers.ReadPostHandler(db))

	r := test.Group("/logged_in")

	r.Use(middleware.JWTAuthorisation())
	{
	}

	test.Run(":8080")
}
