const db = require('./database');

async function createUser(req, res) {
    const { username, password } = req.body;

    try {
        const changes = await db.runQuery('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        console.log(`Rows inserted: ${changes}`);
        res.json({
            "message": "User created successfully",
            "data": { username },
            "success": true
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ "error": err.message });
    }
};

async function getUser(req, res) {
    const username = req.params.username;

    try {
        const row = await db.runQuery('SELECT * FROM users WHERE username = ?', [username]);
        res.json({
            "message": "Success",
            "data": row,
            "success": true
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ "error": err.message });
    }
};

async function updateUser(req, res) {
    const { username, newPassword } = req.body;

    try {
        const changes = await db.runQuery('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
        console.log(`Rows updated: ${changes}`);
        res.json({
            "message": "User updated successfully",
            "data": { username, newPassword },
            "success": true
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ "error": err.message });
    }
};

async function deleteUser(req, res) {
    const username = req.params.username;

    try {
        const changes = await db.runQuery('DELETE FROM users WHERE username = ?', [username]);
        console.log(`Rows deleted: ${changes}`);
        res.json({
            "message": "Deleted successfully",
            "success": true
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ "error": err.message });
    }
};

async function login(req, res) {
    const { username, password } = req.body;

    try {
        const row = await db.runQuery('SELECT * FROM users WHERE username = ?', [username]);
        if (row[0] && password === row[0].password) {
            res.json({
                "message": "Login successful",
                "success": true
            });
        } else {
            res.status(400).json({ "message": "Invalid username or password" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ "error": err.message });
    }
};

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    login
};
