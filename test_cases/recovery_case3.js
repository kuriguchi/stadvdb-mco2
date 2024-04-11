const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Case #3: Failure in writing to the central node when attempting to replicate the transaction from Node 1 or Node 2
const recoveryCase3 = async () => {
    var isNodeOnline = false;

    //mock data
    const data = {
        apptid: '250',
        TimeQueued: '2022-04-27 06:21:09',
        QueueDate: '2022-05-06',
        StartTime: '2022-05-07 02:45:00',
        EndTime: '2022-05-07 03:00:00',
        pxid: 'DC7996BB5EF0306F5394ADA8D9C6CA5B',
        age: '43.0',
        gender: 'FEMALE',
        doctorid: '30A250583BC20CF070AB6C9189508FCC',
        hospitalname: 'The Medical City',
        City: 'Pasig',
        Province: 'Manila',
        RegionName: 'National Capital Region (NCR)'
    };

    //instantialize unavailable node 1 for simulating transaction
    const node1 = new Sequelize(
        'stadvdb_mco2',
        'invalid',
        'invalid',
        {
            host: 'ccscloud.dlsu.edu.ph', 
            port: process.env.SERVER0_PORT,
            dialect: 'mysql'
        }
    );
    //instantialize connection for node2
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

    //authenticate nodes 1 and 2
    node1.authenticate({ timeout: 5000 }).then(() => {
        isNodeOnline = true;
        console.log('Connection to Node 1 server has been established successfully.');
    }).catch((error) => {
        isNodeOnline = false;
        console.error('Unable to connect to Node 1 server.');
    });
    node2.authenticate().then(() => {
        console.log('Connection to Node 2 server has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to Node 2 server');
    });

    //INSERT transaction in node 2
    node2.query(`INSERT INTO appointments VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
            '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.City}', '${data.Province}', '${data.RegionName}')`)
        .then((results) => {
            console.log('Transaction committed successfully.');

            //log INSERT transaction in node 2    
            node2.query(`INSERT INTO logs VALUES ('INSERT', '${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
                '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.City}', '${data.Province}', '${data.RegionName}')`)
                .then((results) => {
                    console.log('Transaction committed successfully.');

                    //if node1 is offline
                    if (isNodeOnline == false) {
                        //get apptid from log
                        node2.query(`SELECT * FROM logs WHERE action LIKE 'INSERT'`)
                            .then((results) => {
                                console.log('Transaction committed successfully.'); 

                                //reverse INSERT transaction in node2 (DELETE)
                                node2.query(`DELETE FROM appointments WHERE apptid LIKE '${results[0][0].apptid}'`)
                                    .then((results) => {
                                        console.log('Transaction committed successfully.');
                                    })
                                    .catch((err) => {
                                        console.log('Transaction Failed: ', err);
                                    });
                                //delete log record
                                node2.query(`DELETE FROM logs WHERE action LIKE 'INSERT'`)
                                    .then((results) => {
                                        console.log('Transaction committed successfully.');
                                    })
                                    .catch((err) => {
                                        console.log('Transaction Failed: ', err);
                                    });
                            })
                            .catch((err) => {
                                console.log('Transaction Failed: ', err);
                            });
                    }
                })
                .catch((err) => {
                    console.log('Transaction Failed: ', err);
                });
        })
        .catch((err) => {
            console.log('Transaction Failed: ', err);
        });
};

module.exports = { recoveryCase3 };