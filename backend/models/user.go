package models

import "time"

type User struct {
	ID             int64     `json:"id"`
	Username       string    `json:"username"`
	PasswordHash   string    `json:"password_hash"`
	Role           string    `json:"role"`
	MembershipType int       `json:"membership_type"`
	CreatedAt      time.Time `json:"created_at"`
}

type CreateUserInput struct {
	Username       string `json:"username" binding:"required"`
	PasswordHash   string `json:"password_hash" binding:"required"`
	Role           string `json:"role" binding:"required"`
	MembershipType int    `json:"membership_type" binding:"required"`
}

// type UpdateUserInput struct {
//     Name           *string `json:"name"`
//     PasswordHash   *string `json:"password_hash"`
//     Role           *string `json:"role"`
//     MembershipType *int    `json:"membership_type"`
// }

type LoginUserData struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
