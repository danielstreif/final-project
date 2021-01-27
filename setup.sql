-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS reset_codes;
-- DROP TABLE IF EXISTS friendships;
-- DROP TABLE IF EXISTS private_messages;
-- DROP TABLE IF EXISTS map_marker CASCADE;
-- DROP TABLE IF EXISTS marker_images;

CREATE TABLE users(
   id SERIAL PRIMARY KEY,
   first VARCHAR(255) NOT NULL,
   last VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   url VARCHAR(255),
   bio VARCHAR,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
   id SERIAL PRIMARY KEY,
   email VARCHAR(255) NOT NULL,
   code VARCHAR(255) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
   id SERIAL PRIMARY KEY,
   sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   recipient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   accepted BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_messages (
   id SERIAL PRIMARY KEY,
   sender_id INT REFERENCES users(id) ON DELETE SET NULL,
   recipient_id INT REFERENCES users(id) ON DELETE SET NULL,
   message VARCHAR NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE map_marker (
   id SERIAL PRIMARY KEY,
   user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   title VARCHAR NOT NULL,
   description VARCHAR NOT NULL,
   long FLOAT NOT NULL,
   lat FLOAT NOT NULL,
   category VARCHAR NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marker_images (
   id SERIAL PRIMARY KEY,
   marker_id INT NOT NULL REFERENCES map_marker(id) ON DELETE CASCADE,
   url VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX ON friendships (least(sender_id, recipient_id), greatest(sender_id, recipient_id));
