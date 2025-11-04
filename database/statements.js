const db = require("better-sqlite3")("database/database.db");

const createTable = {} => {
    const sql = `
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role VARCHAR(20) NOT NULL DEFAULT 'user'
    );
    `;
    db
};



createTable();
