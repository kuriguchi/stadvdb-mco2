const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const recoveryCase2 = async () =>{
    //Case #2: Node 2 or Node 3 is unavailable during the execution of a transaction and then eventually comes back online

    //boolean for node2 and 3 whether it's online
    var isNode2On = false;
    var isNode3On = false;

    const data = {
        apptid: 'A60D60C9E925CE6323F0B950A9A347C8',
        field: 'age',
        value: '10'
    };

    var node1_data = {};
    var node2_data = {};
    var node3_data = {};

    //make node1 online
    const node1 = new Sequelize(
        'stadvdb_mco2', 
        process.env.SERVER0_USER,
        process.env.SERVER0_PASS,
        {
            host: 'ccscloud.dlsu.edu.ph', 
            port: process.env.SERVER0_PORT,
            dialect: 'mysql'
        }
    );

    //instantiate offline nodes
    var node2 = null;
    var node3 = null;

    node1.authenticate().then(() => {
        console.log('Connection to Node 1 server has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to Node 1 server: ', error);
    });

    //transaction for node1
    node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node1.query(`UPDATE appointments SET ${data.field} = '${data.value}' WHERE apptid LIKE '${data.apptid}'`, {
                transaction: t
            })
                .then(([results, metadata]) => {

                    if(isNode2On && isNode3On){
                        return t.commit().then(() => {
                            console.log('Transaction committed successfully.'); 
                            res.json(results[0]);
                        });
                    } else {
                        //connect to node 2 and 3
                        node2 = new Sequelize(
                            'stadvdb_mco2',
                            process.env.SERVER1_USER,
                            process.env.SERVER1_PASS,
                            {
                                host: 'ccscloud.dlsu.edu.ph', 
                                port: process.env.SERVER1_PORT,
                                dialect: 'mysql'
                            }
                        );

                        node3 = new Sequelize(
                            'stadvdb_mco2',
                            process.env.SERVER2_USER,
                            process.env.SERVER2_PASS,
                            {
                                host: 'ccscloud.dlsu.edu.ph', 
                                port: process.env.SERVER2_PORT,
                                dialect: 'mysql'
                            }
                        );

                        node2.authenticate().then(() => {
                            console.log('Connection to Node 2 server has been established successfully.');

                            //authenticate node3
                            node3.authenticate().then(() => {
                                    console.log('Connection to Node 3 server has been established successfully.');

                                    //perform rollback
                                    return t.rollback().then(() => {
                                        console.log('Transaction failed. Performing Rollback operation.');

                                        //query all nodes to check whether they are all the same
                                        node1.query(`SELECT * FROM appointments WHERE apptid = '${data.apptid}'`)
                                            .then((result) => {
                                                node1_data = result[0][0];

                                                console.log('Query Successful on Node 2')

                                                node2.query(`SELECT * FROM appointments WHERE apptid = '${data.apptid}'`)
                                                    .then((result) => {
                                                        node2_data = result[0][0];

                                                        console.log('Query Successful on Node 2')

                                                        node3.query(`SELECT * FROM appointments WHERE apptid = '${data.apptid}'`)
                                                            .then((result) => {
                                                                node3_data = result[0][0];

                                                                console.log('Query Successful on Node 3');

                                                                //compare all results 
                                                                if(JSON.stringify(node1_data) === JSON.stringify(node2_data) ||
                                                                   JSON.stringify(node1_data) === JSON.stringify(node3_data)){

                                                                    console.log('Nodes are Equal. Recovery Successful.');

                                                                    console.log('RESULTS OF NODE 1: ', node1_data);
                                                                    console.log('RESULTS OF NODE 2: ', node2_data);
                                                                    console.log('RESULTS OF NODE 3: ', node3_data);
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
                                            })

                                            .catch((err) => {
                                                console.log('Error: ', err);
                                            });
                                    });

                                }).catch((error) => {
                                    console.error('Unable to connect to Node 3 server: ', error);
                                });
                        }).catch((error) => {
                            console.error('Unable to connect to Node 2 server: ', error);
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

module.exports = { recoveryCase2 };