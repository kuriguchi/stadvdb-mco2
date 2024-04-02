const mysql = require('mysql');
const dotenv = require('dotenv');
const express = require('express');
const hbs = require('hbs');

const app = express();

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(`/`, function(req, res) {
    res.render('index');
});

//connection for server0 (central node)
const server0 = mysql.createConnection({
    host: process.env.SERVER0_HOST,
    user: process.env.SERVER0_USER,
    password: process.env.SERVER0_PASS,
    database: 'stadvdb_mco2'
});

server0.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database.');
    server0.end();
});

// const server1 = mysql.createConnection({
//     host: ''
// })

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
