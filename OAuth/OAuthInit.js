const oauthServer = require('oauth2-server');
const OAuthInit = new oauthServer({
    model: require('./OAuthCore.js'),
    accessTokenLifetime: 60 * 60 * 6,
    refreshTokenLifetime: 60 * 60 * 7,
    debug: true
});

module.exports = OAuthInit;
