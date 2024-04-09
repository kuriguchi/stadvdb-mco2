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

        node2.query ("SELECT count(apptid) FROM appt")
            .then((results) => {
                res.json(results);
            })
            .catch((err) => {
                res.status(500).send('Internal Server Error');
            });
    }
};

module.exports = controller;