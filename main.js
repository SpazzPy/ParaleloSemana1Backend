const cluster = require('cluster');
const express = require('express');
const numCPUs = require('os').cpus().length;
const userController = require('./userController');
const goalsController = require('./goalsController');

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const app = express();

    app.use(express.json()); // For parsing application/json

    // Root URL
    app.get('/', (req, res) => {
        res.send('Paralelo Backend Running');
    });

    app.post('/register', userController.createUser);
    app.get('/user/:id', userController.getUser);
    app.put('/user/:username', userController.updateUser);
    app.delete('/user/:username', userController.deleteUser);

    app.post('/goals', goalsController.createGoal);
    app.get('/goals/:goal_id', goalsController.getGoal);
    app.post('/getAllGoals', goalsController.getAllGoal);
    app.put('/goals/:goal_id', goalsController.updateGoal);
    app.delete('/goals/:goal_id', goalsController.deleteGoal);

    app.post('/login', userController.login);


    app.listen(8000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}
