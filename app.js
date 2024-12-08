const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'study_timer',
    password: 'yourpassword',
    port: 5432,
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sessions ORDER BY start_time DESC');
        res.render('index', { sessions: result.rows });
    } catch (err) {
        console.error(err);
        res.send("Error fetching sessions.");
    }
});

app.post('/start', async (req, res) => {
    try {
        await pool.query('INSERT INTO sessions (start_time) VALUES (DEFAULT)');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Error starting session.");
    }
});

app.post('/stop', async (req, res) => {
    try {
        await pool.query('UPDATE sessions SET end_time = CURRENT_TIMESTAMP WHERE end_time IS NULL');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send("Error stopping session.");
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
