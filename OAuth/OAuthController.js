let oAuthController = function () {
    let oauthServer = require('oauth2-server'),
        messagesService = require('../Services/messagesService'),
        Request = oauthServer.Request,
        Response = oauthServer.Response,
        randomString = require('randomstring'),
        OAuthServices = require('./OAuthServices')();

    let oauth = require('./OAuthInit');

    let tokenProvider = (req, res) => {
        if (req.body.grant_type === 'refresh_token') {
            let request = new Request(req);
            let response = new Response(res);

            oauth.token(request, response)
                .then((token) => {
                    let auth = {
                        token_type: 'Bearer',
                        access_token: token.accessToken,
                        expires_in: Math.abs(parseInt(((token.accessTokenExpiresAt - new Date()) / 1000).toFixed(0))),
                        refresh_token: token.refreshToken
                    };
                    res.send(auth);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(401).json(messagesService.unAuthorized);
                })
        } else {
            OAuthServices.getUser(req.body.username, req.body.password).then((user) => {
                OAuthServices.getClient(user._id).then((client) => {
                    let basicAuth = client.client_id + ':' + client.client_secret;
                    let buffer = new Buffer(basicAuth);
                    let basicAuthBase64 = buffer.toString('base64');
                    req.headers['Authorization'] = "Basic " + basicAuthBase64;
                    let request = new Request(req);
                    let response = new Response(res);

                    oauth.token(request, response)
                        .then((token) => {
                            let auth = createTokenResponse(user, token, basicAuthBase64);
                            res.send(auth);
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(401).json(messagesService.unAuthorized);
                        })
                });
            }).catch((err) => {
                if (err === 401) {
                    res.status(401).send(messagesService.unAuthorized);
                } else
                    res.status(500).send(messagesService.serverError);
            });

        }
    };

    let addUser = (req, res) => {
        OAuthServices.createUser(req.body).then((user) => {
            let oauthClient = {
                client_id: user.username,
                client_secret: randomString.generate(10),
                User: user._id
            };
            OAuthServices.createOAuthClient(oauthClient).then(() => {
                res.status(201).send(messagesService.userCreated);
            })
        }).catch((err) => {
            if (err === 11000)
                res.status(409).send(messagesService.userExists);
            else
                res.status(500).send(messagesService.serverError);
        });
    };

    let logoutUser = (req, res) => {
        OAuthServices.deleteUserTokens(req.user._id).then(() => {
            res.status(200).send();
        }).catch(() => {
            res.status(500).send(messagesService.serverError);
        })
    };

    function createTokenResponse(user, token, basicAuthBase64) {
        return {
            token_type: 'Bearer',
            access_token: token.accessToken,
            expires_in: Math.abs(parseInt(((token.accessTokenExpiresAt - new Date()) / 1000).toFixed(0))),
            refresh_token: token.refreshToken,
            refresh_token_header: "Basic " + basicAuthBase64
        }
    }

    return {
        tokenProvider: tokenProvider,
        addUser: addUser,
        logoutUser: logoutUser
    }
};
module.exports = oAuthController;
