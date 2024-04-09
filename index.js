const mysql = require('mysql');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');
const db = require('./models/db.js');
const routes = require('./routes/routes.js');
const cors = require('cors');

const app = express();

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

//set view engine to EJS
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/', routes);

app.use(function (req, res) {
    res.render('error');
});

//server start
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
