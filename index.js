const mysql = require('mysql');
const dotenv = require('dotenv');
const express = require('express');
const hbs = require('hbs');
const Sequelize = require('sequelize');
const db = require('./models/db.js');
const routes = require('./routes/routes.js');
const cors = require('cors');

const app = express();

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({extended: true}));

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use('/', routes);

app.use(function (req, res) {
    res.render('error');
});

db.connect();

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
