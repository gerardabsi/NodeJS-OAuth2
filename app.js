const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config'),
    compression = require('compression'),
    messagesService = require('./Services/messagesService');

const app = express();
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
require('./OAuth')(app);
mongoose.connect(config.mongodb.database);

require('./RoutersProviders/routerProviders')(app);

const port = 1111;

app.listen(port, () => {
    console.log('server Started on port  ' + port);
});

app.use((req, res) => {
    res.status(404).send(messagesService.noRestFound);
});
