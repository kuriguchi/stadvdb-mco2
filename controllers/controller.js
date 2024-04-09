const os = require('os');

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

        console.log('HOSTNAME: ', currentHost);

        //change name of table when using vm
        node1.query ("SELECT count(apptid) FROM appointments")
            .then((results) => {
                res.json(results);
                console.log('RESULTS: ', results[0][0])
            })
            .catch((err) => {
                res.status(500).send('Internal Server Error');
            });
    },

    //get one appt
    getOneAppt: function(req, res){
        const apptid = req.query.apptid;

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        node1.query(`SELECT * FROM appt WHERE apptid LIKE '${apptid}'`)
            .then((result) => {
                res.json(result[0][0]);
            })
            .catch((err) => {
                console.log('ERROR: ', err);
                res.status(500).send('Internal Server Error');
            });
    },


    // delete one appt
    deleteOneAppt: function(req, res){
        const apptid = req.query.apptid;

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        node1.query(`DELETE * FROM appt WHERE apptid LIKE '${apptid}'`)
            .catch((err) => {
                console.log('ERROR: ', err);
                res.status(500).send('Internal Server Error');
            });
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

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        node1.query(`INSERT INTO * FROM appt VALUES (${data.aptid}, ${data.TimeQueued}, ${data.QueueDate}, ${data.StartTime}, ${data.EndTime}, ${data.pxid}, 
            ${data.age}, ${data.gender}, ${data.doctorid}, ${data.hospitalname}, ${data.City}, ${data.Province}, ${data.RegionName},)`)
            .catch((err) => {
                console.log('ERROR: ', err);
                res.status(500).send('Internal Server Error');
            });
    },
};

module.exports = controller;