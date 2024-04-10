// const db = require('../models/db.js');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();


// Case #1: The central node is unavailable during the execution of a transaction and then eventually comes back online
const recoveryCase1 = async () => {
    var isNodeOnline = false;

    //mock data
    const data = {
        apptid: 'A60D60C9E925CE6323F0B950A9A347C8',
        field: 'age',
        value: '10'
    };



    //instantialize node 2 for simulating transaction
    const node2 = new Sequelize(
        'stadvdb_mco2',
        process.env.SERVER1_USER,
        process.env.SERVER1_PASS,
        {
            host: 'ccscloud.dlsu.edu.ph', 
            port: process.env.SERVER1_PORT,
            dialect: 'mysql'
        }
    );

    // instantialize unavailable connection for node1
    var node1 = new Sequelize(
        'stadvdb_mco2',
        'invalid',
        'invalid',
        {
            host: 'ccscloud.dlsu.edu.ph', 
            port: process.env.SERVER0_PORT,
            dialect: 'mysql',
        }
    );

    //show that node1 is unavailable
    node1.authenticate({ timeout: 5000 }).then(() => {
        isNodeOnline = true;
        console.log('Connection to Node 1 server has been established successfully.');
    }).catch((error) => {
        isNodeOnline = false;
        console.log('+-------------------------+');
        console.log('|      Recovery Case 1    |');
        console.log('+-------------------------+');
        console.error('Unable to connect to Node 1 server.');
    });

    node2.authenticate().then(() => {
        console.log('Connection to Node 2 server has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to Node 2 server');
    });


    //do node2 transaction
    node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node2.query(`UPDATE appointments SET ${data.field} = '${data.value}' WHERE apptid LIKE '${data.apptid}'`, {
                transaction: t
            })
                .then(([results, metadata]) => {

                    if(isNodeOnline){
                        return t.commit().then(() => {
                            console.log('Transaction committed successfully.'); 
                            res.json(results[0]);
                        });
                    } else {
                        //make node online
                        node1 = new Sequelize(
                            'stadvdb_mco2',
                            process.env.SERVER0_USER,
                            process.env.SERVER0_PASS,
                            {
                                host: 'ccscloud.dlsu.edu.ph', 
                                port: process.env.SERVER0_PORT,
                                dialect: 'mysql',
                            }
                        );

                        //test connection
                        node1.authenticate().then(() => {
                            isNodeOnline = true;
                            console.log('Connection to Node 1 server has been established successfully.');

                            //perform rollback operation
                            return t.rollback().then(() => {
                                console.log('Transaction Failed. Performing Rollback operation.');


                                node1.query(`SELECT * FROM appointments WHERE apptid = '${data.apptid}'`)
                                    .then((result) => {
                                        node1_data = result[0][0];

                                        console.log('Query Successful on Node 2')

                                        node2.query(`SELECT * FROM appointments WHERE apptid = '${data.apptid}'`)
                                            .then((result) => {
                                                node2_data = result[0][0];

                                                console.log('Query Successful on Node 2')

                                                if(JSON.stringify(node1_data) === JSON.stringify(node2_data)){
                                                    console.log('Node 1 and 2 are Equal. Recovery Successful.');
                                                    console.log('+-------------------------+');
                                                    console.log('|      Recovery Case 2    |');
                                                    console.log('+-------------------------+');
                                                } else {
                                                    console.log('Recovery Unsuccessful.')
                                                }
                                            })

                                            .catch((err) => {
                                                console.log('Error: ', err);
                                            });
                                    })

                                    .catch((err) => {
                                        console.log('Error: ', err);
                                    });
                            });
                        }).catch((error) => {
                            isNodeOnline = false;
                            console.error('Unable to connect to Node 1 server.');

                            return t.rollback().then(() => {
                                console.log('Transaction Failed. Performing Rollback operation.');
                            });
                        });
                    }
                })

                .catch((err) => {
                    return t.rollback().then(() => {
                        console.log('Transaction Failed: ', err);
                    });
                });
        })

        .catch((err) => {
            console.log('Error starting transaction: ', err);
        });
};

module.exports = { recoveryCase1 };