const mysql = require('mysql');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');

dotenv.config();

    //connection pool for node1 (central node)
    //change database name and host when using vm
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

module.exports = { node1, node2, node3 };