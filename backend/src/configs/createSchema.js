const pool = require('./db');

const createSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firebase_uid VARCHAR(128) UNIQUE NOT NULL,
      display_name VARCHAR(100),
      email VARCHAR(255),
      photo_url TEXT,
      is_guest BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS game_sessions (
      id SERIAL PRIMARY KEY,
      room_code VARCHAR(8) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'waiting',
      player_count INT DEFAULT 2,
      created_by INT REFERENCES users(id),
      winner_id INT REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      finished_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS game_players (
      session_id INT REFERENCES game_sessions(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id),
      hp INT NOT NULL,
      turn_order INT NOT NULL,
      joined_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (session_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS game_moves (
      id SERIAL PRIMARY KEY,
      session_id INT REFERENCES game_sessions(id) ON DELETE CASCADE,
      player_id INT REFERENCES users(id),
      card_ids INT[] NOT NULL,
      target VARCHAR(20) NOT NULL,
      effect INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log(' Schema created');
};

module.exports = createSchema;