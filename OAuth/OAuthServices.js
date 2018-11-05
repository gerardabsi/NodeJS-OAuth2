const OAuthServices = () => {
    const blueBirdPromise = require('bluebird'),
        User = require('./OAuthModels/User'),
        OAuthClient = require('./OAuthModels/OAuthClient'),
        OAuthAccessToken = require('./OAuthModels/OAuthAccessToken'),
        OAuthRefreshToken = require('./OAuthModels/OAuthRefreshToken');

    const createUser = (data) => {
        return new blueBirdPromise((resolve, reject) => {
            let user = new User(data);
            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        reject(11000)
                    } else {
                        reject(false);
                    }
                } else {
                    resolve(user);
                }
            });
        });
    };

    const createOAuthClient = (data) => {
        return new blueBirdPromise((resolve, reject) => {
            let oauthClient = new OAuthClient(data);
            oauthClient.save((err) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(oauthClient);
                }
            });
        });
    };

    const getClient = (user) => {
        return new blueBirdPromise((resolve, reject) => {
            OAuthClient.findOne({User: user}, (err, client) => {
                if (err)
                    reject(err);
                else
                    resolve(client);
            });
        });
    };

    const getUser = (username, password) => {
        return new blueBirdPromise((resolve, reject) => {
            User.findOne({username: username, password: password}, (err, user) => {
                if (err)
                    reject(err);
                else if (user) {
                    resolve(user);
                } else {
                    reject(401);
                }
            });
        });
    };

    const deleteUserTokens = (user) => {
        return new blueBirdPromise((resolve, reject) => {
            OAuthRefreshToken.remove({User: user}, (err) => {
                if (err)
                    reject(err);
                else {
                    OAuthAccessToken.remove({User: user}, (err) => {
                        if (err)
                            reject(err);
                        else
                            resolve(true);
                    });
                }
            });
        });
    };

    return {
        getUser: getUser,
        getClient: getClient,
        createUser: createUser,
        createOAuthClient: createOAuthClient,
        deleteUserTokens: deleteUserTokens
    }
};
module.exports = OAuthServices;