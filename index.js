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

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Stadvdb35_server0',
    database: 'stadvdb_mco2'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database.');
    connection.end();
})

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
