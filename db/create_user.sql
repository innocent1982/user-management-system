CREATE TYPE status_choices AS ENUM('pending','active','inactive','suspended');

CREATE TABLE student(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE CHECK(LENGTH(username) > 6),
    password VARCHAR(20) NOT NULL CHECK(LENGTH(password) > 8),
    status status_choices DEFAULT 'pending',
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);