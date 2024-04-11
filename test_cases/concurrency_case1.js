const Sequelize = require('sequelize');
const db = require('../models/db.js');

const concurrencyCase1 = async () => {
    const node1 = db.node1;
    const node2 = db.node2;
    const node3 = db.node3;

    const apptData = [];
    
    console.log('----------------');
    console.log('    CC Case 1   ');
    console.log('----------------');

    // Case #1: Concurrent transactions in two or more nodes are reading the same data item.

    let start_time = Date.now();
    await Promise.all([
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node1.query(`SELECT * FROM appointments WHERE apptid LIKE '02EAE00E6035E94E804910CA93A3C4CB'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction committed successfully.');
                            console.log('Transaction 1 - Node 1 Reads:'); 
                            console.log(results[0])
                            apptData.push(results[0][0])
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

        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node2.query(`SELECT * FROM appointments WHERE apptid LIKE '02EAE00E6035E94E804910CA93A3C4CB'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction committed successfully.');
                            console.log('Transaction 2 - Node 2 Reads:'); 
                            console.log(results[0])
                            apptData.push(results[0][0])
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

module.exports = { concurrencyCase1 };