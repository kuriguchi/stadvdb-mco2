const express = require('express');
const app = express();

const controller = require('../controllers/controller.js');
const db = require('../models/db.js');

app.use((req, res, next) => {
    req.node1 = db.node1;
    req.node2 = db.node2;
    req.node3 = db.node3;
    next();
});

app.get('/favicon.ico', controller.getFavicon);
app.get('/', controller.getIndex);

//CRUD functionalities
app.get('/appts', controller.getAppts);
app.get('/getOneAppt', controller.getOneAppt);
app.get('/deleteOneAppt', controller.deleteOneAppt);
app.post('/updateAppt', controller.updateAppt);

module.exports = app;