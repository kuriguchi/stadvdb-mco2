const Sequelize = require('sequelize');
const db = require('../models/db.js');

const concurrencyCase3 = async () => {
    const node1 = db.node1;
    const node2 = db.node2;
    const node3 = db.node3;

    const apptData = [];
    
    console.log('----------------');
    console.log('    CC Case 3   ');
    console.log('----------------');

    // Case #3: Concurrent transactions in two or more nodes are writing (update / delete) the same data item.

    let start_time = Date.now();
    await Promise.all([

        // First Transaction - Node 1 modifies a data item
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node1.query(`UPDATE appointments SET age = '22.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
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

        // Second Transaction - Node 2 modifies the same data item to be consistent with Node 1
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node2.query(`UPDATE appointments SET age = '22.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction 2 - UPDATE NODE 2 committed successfully.');
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

        // Third Transaction - Node 2 modifies the same data item
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node2.query(`UPDATE appointments SET age = '35.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction 3 - UPDATE NODE 2 committed successfully.');
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

        // Fourth Transaction - Node 1 modifies the same data item to be consistent with Node 2
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node1.query(`UPDATE appointments SET age = '35.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction 4 - UPDATE NODE 1 committed successfully.');
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

        // Fifth Transaction - Node 1 Read on the same data item
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node1.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 5 - NODE 1 Read:'); 
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

        // Sixth Transaction - Node 2 Read on the same data item
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node2.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 6 - NODE 2 Read:'); 
                        console.log(results[0])
                        apptData.push(results[0])
                    });
                })
    
                .catch((err) => {
                    return t.rollback().then(() => {
                        console.log('Transaction Failed: ', err);
                    });
                });``
        })
    
        .catch((err) => {
            console.log('Error starting transaction: ', err);
        })
    ]);

    console.log('All transactions completed.');
    let time_taken = (Date.now() - start_time) / 1000;
    console.log("Total time taken : " + time_taken + " seconds");
}

module.exports = { concurrencyCase3 };