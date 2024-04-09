const express = require('express');
const app = express();

const controller = require('../controllers/controller.js');
const db = require('../models/db.js');

app.use((req, res, next) => {
    const { node1, node2, node3 } = db.connect();
    req.node1 = node1;
    req.node2 = node2;
    req.node3 = node3;
    next();
});

app.get('/favicon.ico', controller.getFavicon);
app.get('/', controller.getIndex);

//CRUD functionalities
app.get('/appts', controller.getAppts);

module.exports = app;