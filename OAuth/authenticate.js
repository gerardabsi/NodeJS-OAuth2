let oauthServer = require('oauth2-server'),
    Request = oauthServer.Request,
    Response = oauthServer.Response,
    oauth = require('./OAuthInit'),
    messagesService = require('../Services/messagesService');

module.exports = function (options) {
    let option;
    option = options ? options : {};
    return function (req, res, next) {
        let request = new Request({
            headers: {authorization: req.headers.authorization},
            method: req.method,
            query: req.query,
            body: req.body
        });

        let response = new Response(res);
        oauth.authenticate(request, response, option)
            .then(function (token) {
                req.user = token.User;
                next()
            })
            .catch(function (err) {
                res.status(401).json(messagesService.unAuthorized);
            });
    }
};
