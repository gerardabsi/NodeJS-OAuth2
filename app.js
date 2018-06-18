let express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config'),
    compression = require('compression'),
    messagesService = require('./Services/messagesService');

let app = express();
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
require('./OAuth')(app);
mongoose.connect(config.mongodb.database);

require('./RoutersProviders/routerProviders')(app);

let port = 1111;

let server = app.listen(port, () => {
    console.log('server Started on port  ' + port);
});

app.use((req, res) => {
    res.status(404).send(messagesService.noRestFound);
});
process.on('uncaughtException', function (err) {
    console.log(err);
});

