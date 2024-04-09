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

        node1.query ("SELECT * FROM appt")
            .then((results) => {
                res.json(results);
            })
            .catch((err) => {
                res.status(500).send('Internal Server Error');
            });
    },

    //get one appt
    getOneAppt: function(req, res){
        const apptid = req.query.apptid;

        console.log('APPTID: ', apptid);

        const node1 = req.node1;
        const node2 = req.node2;
        const node3 = req.node3; 

        node1.query(`SELECT * FROM appt WHERE apptid LIKE '374453A2EDC54C179E24ABC06083C62F'`)
            .then((result) => {
                console.log('RETURN');
                res.json(result);
            })
            .catch((err) => {
                console.log('ERROR: ', err);
                res.status(500).send('Internal Server Error');
            });
    }
};

module.exports = controller;