const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./paraleloNodeJS.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.configure('busyTimeout', 3000);  // ms
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password TEXT
                )`, (err) => {
                if (err) {
                    console.error("Error creating users table:", err.message);
                }
            });

            db.run(`CREATE TABLE IF NOT EXISTS goals (
                id TEXT PRIMARY KEY,
                username TEXT,
                goal_name TEXT,
                goal_amount REAL,
                interest_rate REAL,
                time_duration INTEGER,
                FOREIGN KEY (username) REFERENCES users(username)
                )`, (err) => {
                if (err) {
                    console.error("Error creating goals table:", err.message);
                }
            });
        });
    }
});

async function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            if (query.trim().startsWith("SELECT")) {
                db.all(query, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            } else {
                db.run(query, params, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes);
                    }
                });
            }
        });
    });
}

module.exports = {
    runQuery,
    close: db.close.bind(db),
};