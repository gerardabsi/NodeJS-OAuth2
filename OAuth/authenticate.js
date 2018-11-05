const oauthServer = require('oauth2-server'),
    Request = oauthServer.Request,
    Response = oauthServer.Response,
    oauth = require('./OAuthInit'),
    messagesService = require('../Services/messagesService');

module.exports = (options) => {
    let option;
    option = options ? options : {};
    return (req, res, next) => {
        const request = new Request({
            headers: {authorization: req.headers.authorization},
            method: req.method,
            query: req.query,
            body: req.body
        });

        const response = new Response(res);
        oauth.authenticate(request, response, option)
            .then((token) => {
                req.user = token.User;
                next()
            })
            .catch(() => {
                res.status(401).json(messagesService.unAuthorized);
            });
    }
};
