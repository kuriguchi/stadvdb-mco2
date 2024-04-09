const mysql = require('mysql');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');

dotenv.config();

const connect = () => {

    //connection pool for node1 (central node)
    const node1 = new Sequelize(
        'central_nodes',
        process.env.SERVER0_USER,
        process.env.SERVER0_PASS,
        {
            host: 'localhost',
            dialect: 'mysql'
        }
    );

    const node2 = new Sequelize(
        'luzon',
        process.env.SERVER1_USER,
        process.env.SERVER1_PASS,
        {
            host: 'localhost',
            dialect: 'mysql'
        }
    );

    const node3 = new Sequelize(
        'south',
        process.env.SERVER2_USER,
        process.env.SERVER2_PASS,
        {
            host: 'localhost',
            dialect: 'mysql'
        }
    );

    node1.authenticate().then(() => {
        console.log('Connection to Node 1 server has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to Node 1 server: ', error);
    });

    node2.authenticate().then(() => {
        console.log('Connection to Node 2 server has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to Node 2 server: ', error);
    });

    node3.authenticate().then(() => {
        console.log('Connection to Node 3 server has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to Node 3 server: ', error);
    });

    return {
        node1, 
        node2, 
        node3
    };
};


module.exports = { connect };