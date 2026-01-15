package models

import "time"

type User struct {
	ID             int64     `json:"id"`
	Username       string    `json:"username"`
	PasswordHash   string    `json:"password_hash"`
	Role           string    `json:"role"`
	MembershipType int       `json:"membership_type"`
	CreatedAt      time.Time `json:"created_at"`
	LastActive     time.Time `json:"lastActive_at"`
}

type CreateUserInput struct {
	ID             int64  `json:"id"`
	Username       string `json:"username"`
	PasswordHash   string `json:"password_hash"`
	Role           string `json:"role"`
	MembershipType int    `json:"membership_type"`
}

type UpdateUserInput struct {
	ID             *int64     `json:"id"`
	Username       *string    `json:"username"`
	PasswordHash   *string    `json:"password_hash"`
	Role           *string    `json:"role"`
	MembershipType *int       `json:"membership_type"`
	CreatedAt      *time.Time `json:"created_at"`
	LastActive     *time.Time `json:"lastActive_at"`
}

type LoginUserData struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
