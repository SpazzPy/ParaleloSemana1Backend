const db = require('./database');
const { v4: uuidv4 } = require('uuid');

async function createGoal(req, res) {
    const { username, goal_name, goal_amount, interest_rate, time_duration } = req.body;
    const goalId = uuidv4();

    try {
        const changes = await db.runQuery('INSERT INTO goals (id, username, goal_name, goal_amount, interest_rate, time_duration) VALUES (?, ?, ?, ?, ?, ?)', [goalId, username, goal_name, goal_amount, interest_rate, time_duration]);
        console.log(`Rows inserted: ${changes}`);
        res.json({
            "message": "Goal created successfully",
            "data": { goalId, username, goal_name, goal_amount, interest_rate, time_duration },
            "success": true
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ "error": err.message });
    }
};

async function getAllGoal(req, res) {
    const username = req.body.username;

    try {
        const row = await db.runQuery('SELECT * FROM goals WHERE username = ?', [username]);
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

async function getGoal(req, res) {
    const goal_id = req.params.goal_id;

    try {
        const row = await db.runQuery('SELECT * FROM goals WHERE id = ?', [goal_id]);
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

async function updateGoal(req, res) {
    const { goal_name, goal_amount, interest_rate, time_duration } = req.body;
    const goal_id = req.params.goal_id;

    try {
        const changes = await db.runQuery('UPDATE goals SET goal_name = ?, goal_amount = ?, interest_rate = ?, time_duration = ? WHERE id = ?', [goal_name, goal_amount, interest_rate, time_duration, goal_id]);
        console.log(`Rows updated: ${changes}`);
        res.json({
            "message": "Goal updated successfully",
            "data": { goal_id, goal_name, goal_amount, interest_rate, time_duration },
            "success": true
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ "error": err.message });
    }
};

async function deleteGoal(req, res) {
    const goal_id = req.params.goal_id;

    try {
        const changes = await db.runQuery('DELETE FROM goals WHERE id = ?', [goal_id]);
        console.log(`Rows deleted: ${changes}`);
        res.json({
            "message": "Goal deleted successfully",
            "success": true
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ "error": err.message });
    }
};

module.exports = {
    createGoal,
    getGoal,
    getAllGoal,
    updateGoal,
    deleteGoal
};