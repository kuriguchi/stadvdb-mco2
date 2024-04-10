const { Cluster } = require("puppeteer-cluster");
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

    await Promise.all([

        
        // First Transaction - Node 1 Reads original data
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node1.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 1 - NODE 1 First Read without any Update:'); 
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

        // Second Transaction - Node 2 Reads original data
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node2.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 2 - NODE 2 First Read without any Update:'); 
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
        }),

        // Third Transaction - Node 1 modifies a data item
        //node1 modifies
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node1.query(`UPDATE appointments SET age = '80.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction 3 - UPDATE NODE 1 committed successfully.');
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

        //node2 also modifies to be consistent with node 1
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                return node2.query(`UPDATE appointments SET age = '80.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
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


        // Fourth Transaction - Node 1 Second Read on First Update by Node 1
        //node 1 read the data item with node 1 update
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node1.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 4 - NODE 1 Second Read on First Update:'); 
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

        // Fifth Transaction - Node 2 Second Read on First Update by Node 1
        //node 2 read the data item with node 1 update
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node2.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 5 - NODE 2 Second Read on First Update:'); 
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
        }),

        // Sixth Transaction - Node 2 modifies the same data item
        //node2 modifies
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node2.query(`UPDATE appointments SET age = '30.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction 6 - UPDATE NODE 2 committed successfully.');
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

    //node1 also modifies to be consistent with node 2
    node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node1.query(`UPDATE appointments SET age = '30.0' WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction 6 - UPDATE NODE 1 committed successfully.');
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

        // Seventh Transaction - Node 1 Third Read on Second Update by Node 2
        //node 1 read the data item with node 2 update
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node1.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 7 - NODE 1 Third Read on Second Update:'); 
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

        // Eighth Transaction - Node 2 Third Read on Second Update by Node 2
        //node 2 read the data item with node 2 update
        node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        .then((t) => {
            return node2.query(`SELECT * FROM appointments WHERE apptid LIKE '02765BFCE9F8FF043DC74F62C4CC57B3'`, {
                transaction: t
            })
                .then(([results, metadata]) => {
                    return t.commit().then(() => {
                        console.log('Transaction committed successfully.');
                        console.log('Transaction 8 - NODE 2 Third Read on Second Update:'); 
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
    console.log('Are Results Equal: ');
    if (apptData.length == 2 && apptData[0] === apptData[1]) {
        console.log(true);
    } else {
        console.log(false);
    }
}

module.exports = { concurrencyCase3 };