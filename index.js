const mysql = require('mysql');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');

const app = express();

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

//set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static('public'));

app.use(`/`, function(req, res) {
    res.render('index');
});

//sample connection pool (mysql workbench)
const sample_sql = new Sequelize(
    'stadvdb_mco2',
    'root',
    'admin',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

//connection pool for node1 (central node)
const node1 = new Sequelize(
    'stadvdb_mco2',
    process.env.SERVER0_USER,
    process.env.SERVER0_PASS,
    {
        host: process.env.SERVER0_HOST,
        dialect: 'mysql'
    }
);

const node2 = new Sequelize(
    'stadvdb_mco2',
    process.env.SERVER1_USER,
    process.env.SERVER1_PASS,
    {
        host: process.env.SERVER1_HOST,
        dialect: 'mysql'
    }
);

const node3 = new Sequelize(
    'stadvdb_mco2',
    process.env.SERVER2_USER,
    process.env.SERVER2_PASS,
    {
        host: process.env.SERVER2_HOST,
        dialect: 'mysql'
    }
);

sample_sql.authenticate().then(() => {
    console.log('Connection to Node 1 server has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to Node 1 server: ', error);
});

//server start
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
