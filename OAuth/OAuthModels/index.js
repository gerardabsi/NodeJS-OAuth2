let config = require('../../config');
let mongoose = require('mongoose');
mongoose.connect(config.mongodb.database, function (err) {
    if (err) return console.log(err);
    console.log('Mongoose Connected');
});
let db = {};
db.OAuthAccessToken = require('./OAuthAccessToken');
db.OAuthClient = require('./OAuthClient');
db.OAuthRefreshToken = require('./OAuthRefreshToken');
db.User = require('./User');

module.exports = db;
