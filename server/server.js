const   express = require('express'),
        app = express(),
        http = require('http').Server(app),
        bodyParser = require('body-parser');

require('babel-polyfill');
require('babel-register');

const rooms = require('./reservations/reservations.js');

app
    .use(function (req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS'){
        res.sendStatus(200);
    } else {

        if (req.query.equipements && !Array.isArray(req.query.equipements)) {
            req.query.equipements = [req.query.equipements];
        }
        next();
    }
    })
    .use(express.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/rooms', rooms.getRooms)
    .post('/reservations', rooms.reserveRoom)
    .use(function (req, res) {
        console.log("ITS A 404", req.headers);
        res.writeHead(404, {"Content-Type" : "text/html"});
        res.write("<p>404 Not Found</p>");
        res.end();
    })
    .listen(3001, function() {
        console.log("Server started listening on 3001")
});

