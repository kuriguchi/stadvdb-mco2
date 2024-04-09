const os = require('os');

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

        switch(currentHost){
            case 'LAPTOP-97MM30R3':
                node1.query(`SELECT * FROM appt WHERE apptid LIKE '${apptid}'`)
                    .then((result) => {
                        res.json(result[0][0]);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });

                break;
            case 'STADVDB35-Server0':
                node1.query(`SELECT * FROM appointments WHERE apptid LIKE '${apptid}'`)
                    .then((result) => {
                        res.json(result[0][0]);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });

                break;

            case 'STADVDB35-Server1':
                node2.query(`SELECT * FROM luzon WHERE apptid LIKE '${apptid}'`)
                    .then((result) => {
                        res.json(result[0][0]);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });

                break;

            case 'STADVDB35-Server2':
                node3.query(`SELECT * FROM south WHERE apptid LIKE '${apptid}'`)
                    .then((result) => {
                        res.json(result[0][0]);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });

                break;

            default:
                node1.query(`SELECT * FROM appt WHERE apptid LIKE '${apptid}'`)
                    .then((result) => {
                        res.json(result[0][0]);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });
                break;
        }
    },


    // delete one appt
    deleteOneAppt: function(req, res){
        const currentHost = os.hostname();

        const apptid = req.query.apptid;

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        if(currentHost == 'LAPTOP-97MM30R3'){
            node1.query(`DELETE FROM appt WHERE apptid LIKE '${apptid}'`)
                .catch((err) => {
                    console.log('ERROR: ', err);
                    res.status(500).send('Internal Server Error');
                });
        } else if(currentHost == 'STADVDB35-Server0'){
            node1.query(`DELETE FROM appointments WHERE apptid LIKE '${apptid}'`)
                .catch((err) => {
                    console.log('ERROR: ', err);
                    res.status(500).send('Internal Server Error');
                });
        } else if(currentHost == 'STADVDB35-Server1'){
            node2.query(`DELETE FROM luzon WHERE apptid LIKE '${apptid}'`)
                .catch((err) => {
                    console.log('ERROR: ', err);
                    res.status(500).send('Internal Server Error');
                });
        } else if(currentHost == 'STADVDB35-Server2'){
            node3.query(`DELETE FROM south WHERE apptid LIKE '${apptid}'`)
                .catch((err) => {
                    console.log('ERROR: ', err);
                    res.status(500).send('Internal Server Error');
                });
        } else {
            console.log('Current Host not found.');
        }
    },

    // update one appt
    updateOneAppt: function(req, res){
        const data = req.body;
        
        let str = data.field
        data.field = str.slice(0, -4);

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        node1.query(`UPDATE * FROM appt SET ${data.field} = '${data.value}' WHERE apptid LIKE '${data.apptid}'`)
            .catch((err) => {
                console.log('ERROR: ', err);
                res.status(500).send('Internal Server Error');
            });
    },

    // create one appt
    createOneAppt: function(req, res){
        const data = req.body;

        const currentHost = os.hostname();

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        switch(currentHost){
            case 'LAPTOP-97MM30R3':

                node1.query(`INSERT INTO appt VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
                    '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.city}', '${data.Province}', '${data.RegionName}')`)
                    .then((result) => {
                        console.log('Inserted One Document: ', result);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });

                //add to luzon if location is in luzon
                if(data.RegionName in luzon){
                    node2.query(`INSERT INTO luzon VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
                        '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.city}', '${data.Province}', '${data.RegionName}')`)
                        .then((result) => {
                            console.log('Inserted One Document: ', result);
                        })
                        .catch((err) => {
                            console.log('ERROR: ', err);
                            res.status(500).send('Internal Server Error');
                        });
                }

                if(data.RegionName in vizmin){
                    node3.query(`INSERT INTO south VALUES ('${data.apptid}', '${data.TimeQueued}', '${data.QueueDate}', '${data.StartTime}', '${data.EndTime}', '${data.pxid}', 
                        '${data.age}', '${data.gender}', '${data.doctorid}', '${data.hospitalname}', '${data.city}', '${data.Province}', '${data.RegionName}')`)
                        .then((result) => {
                            console.log('Inserted One Document: ', result);
                        })
                        .catch((err) => {
                            console.log('ERROR: ', err);
                            res.status(500).send('Internal Server Error');
                        });
                }

                //add to south if location is south

                break;
            case 'STADVDB35-Server0':   
                node1.query(`INSERT INTO appointments VALUES (${data.aptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
                    ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`)
                    .then((result) => {
                        console.log('Inserted One Document: ', result);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });
                break;
            case 'STADVDB35-Server1':
                node2.query(`INSERT INTO luzon VALUES (${data.aptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
                    ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`)
                    .then((result) => {
                        console.log('Inserted One Document: ', result);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });
                
                break;
            case 'STADVDB35-Server2':

                node3.query(`INSERT INTO south VALUES (${data.aptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
                    ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`)
                    .then((result) => {
                        console.log('Inserted One Document: ', result);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });

                break;
            default:
                node1.query(`INSERT INTO appt VALUES (${data.aptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
                    ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`)
                    .then((result) => {
                        console.log('Inserted One Document: ', result);
                    })
                    .catch((err) => {
                        console.log('ERROR: ', err);
                        res.status(500).send('Internal Server Error');
                    });

                break;
            
        }
    },
};

module.exports = controller;