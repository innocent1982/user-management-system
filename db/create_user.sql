CREATE TYPE role_choices AS ENUM('admin', 'classic');

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE CHECK(LENGTH(username) > 6),
    password VARCHAR(20) NOT NULL CHECK(LENGTH(password) > 8),
    email VARCHAR(255) NOT NULL UNIQUE,
    role role_choices DEFAULT 'classic',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);