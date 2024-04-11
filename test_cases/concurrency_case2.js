const Sequelize = require('sequelize');
const db = require('../models/db.js');

const concurrencyCase2 = async () => {
    const node1 = db.node1;
    const node2 = db.node2;
    const node3 = db.node3;

    const apptData = [];
    
    console.log('----------------');
    console.log('    CC Case 2   ');
    console.log('----------------');

    // Case #2: At least one transaction in the three nodes is writing (update / delete) and the other concurrent transactions are reading the same data item.

    let start_time = Date.now();
    await Promise.all([

        //node1 modifies
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node1.query(`UPDATE appointments SET age = '21.0' WHERE apptid LIKE '09B6FE2CF8E815A65FECFD6EC5FECFD5'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction 1 - UPDATE NODE 1 committed successfully.');
                        });
                    })
        
                    .catch((err) => {
                        return t.rollback().then(() => {
                            console.log('Transaction Failed: ', err);
                        });
                    });
            })
        
            .catch((err) => {
                console.log('Error starting transaction: ', err);
            }),

        //node3 also modifies
        node3.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node3.query(`UPDATE appointments SET age = '21.0' WHERE apptid LIKE '09B6FE2CF8E815A65FECFD6EC5FECFD5'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction 1 - UPDATE NODE 3 committed successfully.');
                        });
                    })
        
                    .catch((err) => {
                        return t.rollback().then(() => {
                            console.log('Transaction Failed: ', err);
                        });
                    });
            })
        
            .catch((err) => {
                console.log('Error starting transaction: ', err);
            }),

        // node 1 reads
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node1.query(`SELECT * FROM appointments WHERE apptid LIKE '09B6FE2CF8E815A65FECFD6EC5FECFD5'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction committed successfully.');
                            console.log('Transaction 2 - NODE 3 First Read:'); 
                            console.log(results[0])
                            apptData.push(results[0])
                        });
                    })
        
                    .catch((err) => {
                        return t.rollback().then(() => {
                            console.log('Transaction Failed: ', err);
                        });
                    });
            })
        
            .catch((err) => {
                console.log('Error starting transaction: ', err);
            }),

        //node 3 reads again
        node3.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node3.query(`SELECT * FROM appointments WHERE apptid LIKE '09B6FE2CF8E815A65FECFD6EC5FECFD5'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 3 - NODE 3 Second Read:'); 
                        console.log(results[0])
                        apptData.push(results[0])
                    });
                })
    
                .catch((err) => {
                    return t.rollback().then(() => {
                        console.log('Transaction Failed: ', err);
                    });
                });
        })
    
        .catch((err) => {
            console.log('Error starting transaction: ', err);
        })
    ]);

    console.log('All transactions completed.');
    
    let time_taken = (Date.now() - start_time) / 1000;
    console.log("Total time taken : " + time_taken + " seconds");
}

module.exports = { concurrencyCase2 };