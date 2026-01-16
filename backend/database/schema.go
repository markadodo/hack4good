package database

import (
	"database/sql"
)

// database creation
func InitDB(db *sql.DB) error {

	schematables := `

	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username TEXT NOT NULL,
		password_hash TEXT NOT NULL,
		role TEXT NOT NULL CHECK (role IN ('participant', 'staff', 'volunteer')),
		membership_type INT CHECK (membership_type IN (0, 1, 2, 3, 4)),
		created_at TIMESTAMPTZ NOT NULL
	);

	CREATE TABLE IF NOT EXISTS activities (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		description TEXT NOT NULL,
		location TEXT NOT NULL,
		meetup_location TEXT[] NOT NULL,
		start_time TIMESTAMPTZ NOT NULL,
		end_time TIMESTAMPTZ NOT NULL,
		wheelchair_access BOOLEAN DEFAULT FALSE,
		payment_required BOOLEAN DEFAULT FALSE,
		participant_vacancy INT NOT NULL,
		volunteer_vacancy INT NOT NULL,
		created_by INT REFERENCES users(id),
		created_at TIMESTAMPTZ NOT NULL
	);

	CREATE TABLE IF NOT EXISTS registrations (
		id SERIAL PRIMARY KEY,
		user_id INT REFERENCES users(id) ON DELETE CASCADE,
		activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
		meetup_location TEXT NOT NULL,
		registered_at TIMESTAMPTZ DEFAULT NOW(),
		UNIQUE(user_id, activity_id)
	);
	`

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset := `
	DROP TRIGGER IF EXISTS reduce_vacancy_trigger ON registrations;
	`

	vacancyCounterHandler := `
	CREATE OR REPLACE FUNCTION reduce_vacancy() 
	RETURNS TRIGGER AS $$
	BEGIN
		-- Check the role of the registering user
		IF (SELECT role FROM users WHERE id = NEW.user_id) = 'participant' THEN
			UPDATE activities
			SET participant_vacancy = participant_vacancy - 1
			WHERE id = NEW.activity_id;
		ELSIF (SELECT role FROM users WHERE id = NEW.user_id) = 'volunteer' THEN
			UPDATE activities
			SET volunteer_vacancy = volunteer_vacancy - 1
			WHERE id = NEW.activity_id;
		END IF;

		RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;
	`

	vacancyCounter := `
	CREATE TRIGGER reduce_vacancy_trigger
	AFTER INSERT ON registrations
	FOR EACH ROW
	EXECUTE FUNCTION reduce_vacancy();
	`
	//////////////////////////////////////////////////////////////////////////////////////////////////////////

	insertsystemUser := `
	INSERT INTO users (id, username, password_hash, role, membership_type, created_at)
	VALUES (0, 'deleted_users', '!', 'staff', 4, NOW())
	ON CONFLICT(id) DO NOTHING;
	`

	tables := []string{
		schematables,
	}

	triggers := []string{
		reset,
		vacancyCounterHandler,
		vacancyCounter,
	}

	for _, table := range tables {
		_, err := db.Exec(table)
		if err != nil {
			return err
		}
	}

	for _, trigger := range triggers {
		_, err := db.Exec(trigger)
		if err != nil {
			return err
		}
	}

	if _, err := db.Exec(insertsystemUser); err != nil {
		return err
	}

	return nil
}
