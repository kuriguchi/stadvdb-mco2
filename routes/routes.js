const express = require('express');
const app = express();

const controller = require('../controllers/controller.js');
const db = require('../models/db.js');

const middleware = (req, res, next) => {
    req.node1 = db.node1;
    req.node2 = db.node2;
    req.node3 = db.node3;
    next();
};

app.get('/favicon.ico', controller.getFavicon);
app.get('/', controller.getIndex);

//CRUD functionalities
app.get('/appts', controller.getAppts);
app.get('/getOneAppt', middleware, controller.getOneAppt);
app.get('/deleteOneAppt', middleware, controller.deleteOneAppt);
app.post('/updateOneAppt', middleware, controller.updateOneAppt);
app.post('/createOneAppt', middleware, controller.createOneAppt);

module.exports = app;