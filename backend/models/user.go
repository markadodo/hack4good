package models

import "time"

type User struct {
	ID             int64     `json:"id"`
	Username       string    `json:"username"`
	Password       string    `json:"-"`
	PasswordHash   string    `json:"-"`
	Role           string    `json:"role"`
	MembershipType int       `json:"membership_type"`
	CreatedAt      time.Time `json:"created_at"`
}

type CreateUserInput struct {
	Username       string `json:"username"`
	Password       string `json:"password"`
	Role           string `json:"role"`
	MembershipType int    `json:"membership_type"`
}

type UpdateUserInput struct {
	Username       *string `json:"username"`
	Password       *string `json:"password"`
	MembershipType *int    `json:"membership_type"`
}

type LoginUserData struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
