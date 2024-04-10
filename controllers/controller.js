const os = require('os');
const { Sequelize } = require('sequelize');

const luzon = {
    ncr: 'National Capital Region (NCR)',
    iva: 'CALABARZON (IV-A)',
    cl: 'Central Luzon (III)',
    ir: 'Ilocos Region (I)'
};

const vizmin = {
    cr: 'SOCCSKSARGEN (Cotabato Region) (XII)'
};

var regionName = '';




const controller =  {
    getFavicon: function(req, res){
        res.status(204);
    },

    getIndex: function(req, res){
        res.render('index');
    },

    //CRUD
    getAppts: function(req, res){
        const currentHost = os.hostname();

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3;

        //change name of table when using vm

        if(currentHost == 'LAPTOP-97MM30R3'){
            node1.query ("SELECT count(apptid) FROM appt")
                .then((results) => {
                    res.json(results);
                    console.log('RESULTS: ', results[0][0])
                })  
                .catch((err) => {
                    res.status(500).send('Internal Server Error');
                });
        } else if(currentHost == 'STADVDB35-Server0'){

            node1.query ("SELECT count(apptid) FROM appointments")
                .then((results) => {
                    res.json(results);
                    console.log('RESULTS: ', results[0][0])
                })  
                .catch((err) => {
                    res.status(500).send('Internal Server Error');
                });
        } else if(currentHost == 'STADVDB35-Server1'){
            node2.query ("SELECT count(apptid) FROM luzon")
                .then((results) => {
                    res.json(results);
                    console.log('RESULTS: ', results[0][0])
                })  
                .catch((err) => {
                    res.status(500).send('Internal Server Error');
                });
        } else if(currentHost == 'STADVDB35-Server2'){
            node3.query ("SELECT count(apptid) FROM south")
                .then((results) => {
                    res.json(results);
                    console.log('RESULTS: ', results[0][0])
                })  
                .catch((err) => {
                    res.status(500).send('Internal Server Error');
                });
        } else {
            console.log('Current Host cannot be found.');
        }
    },

    //get one appt
    getOneAppt: function(req, res){
        const apptid = req.query.apptid;

        const currentHost = os.hostname();

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3;

        const readAppt = (node, apptid) => {
            node.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
                .then((t) => {
                    return node.query(`SELECT * FROM appointments WHERE apptid LIKE '${apptid}'`, {
                        transaction: t
                    })
                        .then(([results, metadata]) => {
                            return t.commit().then(() => {
                                console.log('Transaction committed successfully.'); 
                                res.json(results[0]);
        
                                console.log(results[0])
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
                });
        };

        switch(currentHost){
            case 'LAPTOP-97MM30R3':
                readAppt(node1, apptid);

                break;
            case 'STADVDB35-Server0':
                readAppt(node1, apptid);
                    
                break;

            case 'STADVDB35-Server1':
                readAppt(node2, apptid);

                break;

            case 'STADVDB35-Server2':
                readAppt(node3, apptid);

                break;

            default:
                readAppt(node1, apptid);
                break;
        }
    },


    // delete one appt
    deleteOneAppt: function(req, res){
        const currentHost = os.hostname();

        const apptid = req.query.apptid;

        const nodes = {
            node1: req.node1,
            node2: req.node2,
            node3: req.node3
        };

        for(let key in nodes) {
            nodes[key].transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
                    .then((t) => {
                        return nodes[key].query(`DELETE FROM appointments WHERE apptid LIKE '${apptid}'`, {
                            transaction: t
                        })
                            .then(([results, metadata]) => {
                                return t.commit().then(() => {
                                    console.log('Transaction committed successfully.'); 
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
                    });
        }
    },

    // update one appt
    updateOneAppt: function(req, res){
        const data = req.body;
        
        let str = data.field
        data.field = str.slice(0, -4);

        const nodes = {
            node1: req.node1,
            node2: req.node2,
            node3: req.node3
        };

        for(let key in nodes){
            nodes[key].transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
                .then((t) => {
                    return nodes[key].query(`UPDATE appointments SET ${data.field} = '${data.value}' WHERE apptid LIKE '${data.apptid}'`, {
                        transaction: t
                    })
                        .then(([results, metadata]) => {
                            return t.commit().then(() => {
                                console.log('Transaction committed successfully.'); 
                                res.json(results[0]);
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
                });
        }
    },

    // create one appt
    createOneAppt: function(req, res){
        const data = req.body;

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        const nodes = {
            node1: req.node1,
            node2: req.node2,
            node3: req.node3
        };

        const regionSelector = (region) => {
            const isLuzon = 0;

            if(data.region in luzon){
                node2.query(`INSERT INTO luzon VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
                    '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.city}', '${data.Province}', '${data.RegionName}')`)
                    .then((result) => {
                        console.log('Inserted One Document: ', result);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });
            } else {
                
            }
        }

        //update central first
        node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
            .then((t) => {
                if(data.RegionName in luzon) {
                    
                }
                return node1.query(`INSERT INTO appointments VALUES (${data.apptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
                    ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`, {
                    transaction: t
                })
                    .then(([results, metadata]) => {
                        return t.commit().then(() => {
                            console.log('Transaction committed successfully.'); 
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
            });

        //update 
        regionSelector(data.RegionName);

        

        // switch(currentHost){
        //     case 'LAPTOP-97MM30R3':

        //         node1.query(`INSERT INTO appt VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
        //             '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.city}', '${data.Province}', '${data.RegionName}')`)
        //             .then((result) => {
        //                 console.log('Inserted One Document: ', result);


        //             })
        //             .catch((err) => {
        //                 console.log('ERROR: ', err);
        //                 res.status(500).send('Internal Server Error');
        //             });

        //         //add to luzon if location is in luzon
        //         if(data.RegionName in luzon){
        //             node2.query(`INSERT INTO luzon VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
        //                 '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.city}', '${data.Province}', '${data.RegionName}')`)
        //                 .then((result) => {
        //                     console.log('Inserted One Document: ', result);
        //                 })
        //                 .catch((err) => {
        //                     console.log('ERROR: ', err);
        //                     res.status(500).send('Internal Server Error');
        //                 });
        //         }

        //         if(data.RegionName in vizmin){
        //             node3.query(`INSERT INTO south VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
        //                 '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.city}', '${data.Province}', '${data.RegionName}')`)
        //                 .then((result) => {
        //                     console.log('Inserted One Document: ', result);
        //                 })
        //                 .catch((err) => {
        //                     console.log('ERROR: ', err);
        //                     res.status(500).send('Internal Server Error');
        //                 });
        //         }

        //         //add to south if location is south

        //         break;
        //     case 'STADVDB35-Server0':
        //         node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        //             .then((t) => {
        //                 if(data.RegionName in luzon) {
                            
        //                 }
        //                 return node1.query(`INSERT INTO appointments VALUES (${data.apptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
        //                     ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`, {
        //                     transaction: t
        //                 })
        //                     .then(([results, metadata]) => {
        //                         return t.commit().then(() => {
        //                             console.log('Transaction committed successfully.'); 
        //                         });
        //                     })
        //                     .catch((err) => {
        //                         return t.rollback().then(() => {
        //                             console.log('Transaction Failed: ', err);
        //                         });
        //                     });
        //             })
        //             .catch((err) => {
        //                 console.log('Error starting transaction: ', err);
        //             });
        //         break;
        //     case 'STADVDB35-Server1':
        //         node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        //             .then((t) => {
        //                 return node2.query(`INSERT INTO luzon VALUES (${data.apptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
        //                     ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`, {
        //                     transaction: t
        //                 })
        //                     .then(([results, metadata]) => {
        //                         return t.commit().then(() => {
        //                             console.log('Transaction committed successfully.'); 
        //                         });
        //                     })
        //                     .catch((err) => {
        //                         return t.rollback().then(() => {
        //                             console.log('Transaction Failed: ', err);
        //                         });
        //                     });
        //             })
        //             .catch((err) => {
        //                 console.log('Error starting transaction: ', err);
        //             });
        //         break;
        //     case 'STADVDB35-Server2':
        //         node3.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        //         .then((t) => {
        //             return node3.query(`INSERT INTO south VALUES (${data.apptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
        //                 ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`, {
        //                 transaction: t
        //             })
        //                 .then(([results, metadata]) => {
        //                     return t.commit().then(() => {
        //                         console.log('Transaction committed successfully.'); 
        //                     });
        //                 })
        //                 .catch((err) => {
        //                     return t.rollback().then(() => {
        //                         console.log('Transaction Failed: ', err);
        //                     });
        //                 });
        //         })
        //         .catch((err) => {
        //             console.log('Error starting transaction: ', err);
        //         });
        //         break;
        //     default:
        //         node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE })
        //             .then((t) => {
        //                 return node1.query(`INSERT INTO appointments VALUES (${data.apptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
        //                     ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`, {
        //                     transaction: t
        //                 })
        //                     .then(([results, metadata]) => {
        //                         return t.commit().then(() => {
        //                             console.log('Transaction committed successfully.'); 
        //                         });
        //                     })
        //                     .catch((err) => {
        //                         return t.rollback().then(() => {
        //                             console.log('Transaction Failed: ', err);
        //                         });
        //                     });
        //             })
        //             .catch((err) => {
        //                 console.log('Error starting transaction: ', err);
        //             });           


    // TEST AREA

    // Concurrent Read Test (Step 2 Case 1)
    // testReadConcurrency: function(req, res){
    //     const apptid = 'ABC123' // Change value to a real appt id in luzon
    //     const node1 = req.node1;
    //     const node2 = req.node2;

    //     // this should run all transactions concurrently
    //     Promise.all([
    //         node1.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE})
    //         .then((t) => {
    //             // Get the appointment and sleep for 10 seconds
    //             return node1.query(`SELECT * FROM appointments WHERE apptid LIKE '${apptid}' DO SLEEP(10000)`, {
    //                 transaction: t
    //             })
    //                 .then(([results, metadata]) => {
    //                     return t.commit().then(() => {
    //                         const n1_result = results[0];
    //                         console.log("Node 1 Result:", n1_result);
    //                     });
    //                 })

    //                 .catch((err) => {
    //                     return t.rollback().then(() => {
    //                         console.log('Transaction Failed: ', err);
    //                     });
    //                 });
    //         }),

    //         node2.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE})
    //         .then((t) => {
    //             // Get the appointment and sleep for 10 seconds
    //             return node2.query(`SELECT * FROM luzon WHERE apptid LIKE '${apptid}' DO SLEEP(10000)`, {
    //                 transaction: t
    //             })
    //                 .then(([results, metadata]) => {
    //                     return t.commit().then(() => {
    //                         const n2_result = results[0];
    //                         console.log("Node 2 Result:", n2_result);
    //                     });
    //                 })

    //                 .catch((err) => {
    //                     return t.rollback().then(() => {
    //                         console.log('Transaction Failed: ', err);
    //                     });
    //                 });
    //         })
    //     ])
    //     .then(() => {
    //         // Send response or perform further actions
    //         res.send("Transactions completed successfully");
    //     })
    //     .catch((err) => {
    //         // Handle errors if any
    //         console.error("Error:", err);
    //         res.status(500).send("Error occurred during transactions");
    //     });
    }
}

module.exports = controller;