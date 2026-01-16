package database

import (
	"backend/models"
	"database/sql"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/lib/pq"
)

func CreateActivity(db *sql.DB, input *models.CreateActivityInput) error {
	createdAt := time.Now()

	query := `
	INSERT INTO activities (
		title,
		description,
		location,
		meetup_location,
		start_time,
		end_time,
		wheelchair_access,
		payment_required,
		participant_vacancy,
		volunteer_vacancy,
		created_by,
		created_at
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
	`
	_, err := db.Exec(
		query,
		input.Title,
		input.Description,
		input.Location,
		pq.Array(input.MeetupLocation),
		input.StartTime,
		input.EndTime,
		input.WheelchairAccess,
		input.PaymentRequired,
		input.ParticipantVacancy,
		input.VolunteerVacancy,
		input.CreatedBy,
		createdAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func ReadActivityByID(db *sql.DB, id int64) (*models.Activity, error) {
	activity := models.Activity{}

	query := `
	SELECT id, title, description, location, meetup_location, start_time, end_time, 
		wheelchair_access, payment_required, participant_vacancy, volunteer_vacancy, created_by, created_at
	FROM activities
	WHERE id = $1
	`
	err := db.QueryRow(query, id).Scan(&activity.ID, &activity.Title, &activity.Description,
		&activity.Location, pq.Array(&activity.MeetupLocation), &activity.StartTime, &activity.EndTime,
		&activity.WheelchairAccess, &activity.PaymentRequired, &activity.ParticipantVacancy,
		&activity.VolunteerVacancy, &activity.CreatedBy, &activity.CreatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &activity, nil
}

func UpdateActivityByID(db *sql.DB, id int64, input *models.UpdateActivityInput) (bool, bool, error) {
	updates := []string{}
	args := []interface{}{}
	counter := 1

	if input.Title != nil {
		updates = append(updates, "title = $"+strconv.Itoa(counter))
		args = append(args, *input.Title)
		counter += 1
	}

	if input.Description != nil {
		updates = append(updates, "description = $"+strconv.Itoa(counter))
		args = append(args, *input.Description)
		counter += 1
	}

	if input.Location != nil {
		updates = append(updates, "location = $"+strconv.Itoa(counter))
		args = append(args, *input.Location)
		counter += 1
	}

	if input.MeetupLocation != nil {
		updates = append(updates, "meetup_location = $"+strconv.Itoa(counter))
		args = append(args, pq.Array(*input.MeetupLocation))
		counter += 1
	}

	if input.StartTime != nil {
		updates = append(updates, "start_time = $"+strconv.Itoa(counter))
		args = append(args, *input.StartTime)
		counter += 1
	}

	if input.EndTime != nil {
		updates = append(updates, "end_time = $"+strconv.Itoa(counter))
		args = append(args, *input.EndTime)
		counter += 1
	}

	if input.WheelchairAccess != nil {
		updates = append(updates, "wheelchair_access = $"+strconv.Itoa(counter))
		args = append(args, *input.WheelchairAccess)
		counter += 1
	}

	if input.PaymentRequired != nil {
		updates = append(updates, "payment_required = $"+strconv.Itoa(counter))
		args = append(args, *input.PaymentRequired)
		counter += 1
	}

	if input.ParticipantVacancy != nil {
		updates = append(updates, "participant_vacancy = $"+strconv.Itoa(counter))
		args = append(args, *input.ParticipantVacancy)
		counter += 1
	}

	if input.VolunteerVacancy != nil {
		updates = append(updates, "volunteer_vacancy = $"+strconv.Itoa(counter))
		args = append(args, *input.VolunteerVacancy)
		counter += 1
	}

	if len(updates) == 0 {
		return true, false, nil
	}

	query := "UPDATE activities SET " + strings.Join(updates, ", ") + " WHERE id = $" + strconv.Itoa(counter)
	args = append(args, id)
	res, err := db.Exec(query, args...)

	if err != nil {
		return false, false, err
	}

	if count, _ := res.RowsAffected(); count == 0 {
		return false, true, nil
	}

	return false, false, nil
}

func DeleteActivityByID(db *sql.DB, id int64) (bool, error) {
	query := "DELETE FROM activities WHERE id = $1"
	res, err := db.Exec(query, id)

	if err != nil {
		return false, err
	}

	if count, _ := res.RowsAffected(); count == 0 {
		return true, nil
	}

	return false, nil
}

func GetActivityOwnerByID(db *sql.DB, activityID int64) (int64, error) {
	activityData, err := ReadActivityByID(db, activityID)

	if err != nil {
		return 0, err
	}

	if activityData == nil {
		return 0, nil
	}

	return activityData.CreatedBy, err
}

// func ReadPostByTopicID(db *sql.DB, topicID int64, limit int, offset int, sortBy string, order string) ([]models.Post, error) {
// 	var posts []models.Post

// 	query := `
// 	SELECT id, title, description, topic_id, likes, dislikes, is_edited, views, popularity, created_by, created_at
// 	FROM posts
// 	WHERE topic_id = $1
// 	ORDER BY ` + sortBy + " " + order + `
// 	LIMIT $2 OFFSET $3`

// 	rows, err := db.Query(
// 		query,
// 		topicID,
// 		limit,
// 		offset,
// 	)

// 	if err != nil {
// 		return posts, err
// 	}

// 	defer rows.Close()

// 	for rows.Next() {
// 		var post models.Post

// 		if err := rows.Scan(&post.ID, &post.Title, &post.Description, &post.TopicID, &post.Likes, &post.Dislikes, &post.IsEdited, &post.Views, &post.Popularity, &post.CreatedBy, &post.CreatedAt); err != nil {
// 			return posts, err
// 		}

// 		posts = append(posts, post)
// 	}

// 	if err := rows.Err(); err != nil {
// 		return posts, err
// 	}

// 	return posts, nil
// }

// func ReadPostBySearchQuery(db *sql.DB, topicID int64, limit int, offset int, sortBy string, order string, searchQuery string) ([]models.Post, error) {
// 	var posts []models.Post
// 	args := []interface{}{searchQuery}
// 	counter := 2

// 	query := `
// 	SELECT id, title, description, topic_id, likes, dislikes, is_edited, views, popularity, created_by, created_at
// 	FROM posts, plainto_tsquery('english', $1) AS query
// 	WHERE document @@ query
// 	`

// 	if topicID != 0 {
// 		query = query + " AND posts.topic_id = $" + strconv.Itoa(counter)
// 		args = append(args, topicID)
// 		counter += 1
// 	}

// 	if sortBy == "relevance" {
// 		sortBy = "ts_rank(document, query)"
// 	}

// 	query = query + " ORDER BY " + sortBy + " " + order + " LIMIT $" + strconv.Itoa(counter) + " OFFSET $" + strconv.Itoa(counter+1)
// 	args = append(args, limit, offset)

// 	rows, err := db.Query(query, args...)

// 	if err != nil {
// 		return posts, err
// 	}

// 	defer rows.Close()

// 	for rows.Next() {
// 		var post models.Post

// 		if err := rows.Scan(&post.ID, &post.Title, &post.Description, &post.TopicID, &post.Likes, &post.Dislikes, &post.IsEdited, &post.Views, &post.Popularity, &post.CreatedBy, &post.CreatedAt); err != nil {
// 			return posts, err
// 		}

// 		posts = append(posts, post)
// 	}

// 	if err := rows.Err(); err != nil {
// 		return posts, err
// 	}

// 	return posts, nil
// }

// var ErrDuplicatePostReaction = errors.New("reaction already exists")

// func CreatePostReaction(db *sql.DB, input *models.PostReaction) error {
// 	query := `
// 	INSERT INTO posts_reactions (
// 		post_id,
// 		user_id,
// 		reaction
// 	)
// 	VALUES ($1, $2, $3);
// 	`

// 	_, err := db.Exec(query, input.PostID, input.UserID, input.Reaction)

// 	if err != nil {
// 		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
// 			return ErrDuplicatePostReaction
// 		}
// 		log.Println(err)
// 		return err
// 	}

// 	return nil
// }

// func DeletePostReactionByPostIDAndUserID(db *sql.DB, postID int64, userID int64) (bool, error) {
// 	query := "DELETE FROM posts_reactions WHERE post_id = $1 AND user_id = $2"
// 	res, err := db.Exec(query, postID, userID)

// 	if err != nil {
// 		return false, err
// 	}

// 	if count, _ := res.RowsAffected(); count == 0 {
// 		return true, nil
// 	}

// 	return false, nil
// }

func ReadActivity(db *sql.DB, limit int, offset int, sortBy string, order string) ([]models.Activity, error) {
	var activities []models.Activity
	args := []interface{}{}

	query := `
	SELECT id, title, description, location, meetup_location, start_time, end_time, 
		wheelchair_access, payment_required, participant_vacancy, volunteer_vacancy, created_by, created_at
	FROM activities
	`

	query = query + " ORDER BY " + sortBy + " " + order + " LIMIT $1 OFFSET $2"
	args = append(args, limit, offset)

	rows, err := db.Query(query, args...)

	if err != nil {
		log.Fatal("1")
		return activities, err
	}

	defer rows.Close()

	for rows.Next() {
		var activity models.Activity

		if err := rows.Scan(&activity.ID, &activity.Title, &activity.Description, &activity.Location,
			pq.Array(&activity.MeetupLocation), &activity.StartTime, &activity.EndTime,
			&activity.WheelchairAccess, &activity.PaymentRequired, &activity.ParticipantVacancy,
			&activity.VolunteerVacancy, &activity.CreatedBy, &activity.CreatedAt); err != nil {
			return activities, err
		}

		activities = append(activities, activity)
	}

	if err := rows.Err(); err != nil {
		log.Fatal("2")
		return activities, err
	}

	return activities, nil
}
