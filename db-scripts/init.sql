\c gatortrader
\l
CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    profile_pic BYTEA,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_token VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE users TO sammy;

\l
