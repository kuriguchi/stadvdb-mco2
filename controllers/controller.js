const controller =  {
    getFavicon: function(req, res){
        res.status(204);
    },

    getIndex: function(req, res){
        res.render('index');
    },

    //CRUD
    getAppts: function(req, res){
        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3;

        node1.query ("SELECT count(apptid) FROM appt")
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
};

module.exports = controller;