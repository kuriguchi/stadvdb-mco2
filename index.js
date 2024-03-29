const dotenv = require('dotenv');
const express = require('express');
const hbs = require('hbs');

const app = express();

dotenv.config();
port = process.env.PORT;
hostname = process.env.HOSTNAME;

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(`/`, function(req, res) {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
