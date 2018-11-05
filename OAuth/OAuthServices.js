let OAuthServices = () => {
    let blueBirdPromise = require('bluebird'),
        User = require('./OAuthModels/User'),
        OAuthClient = require('./OAuthModels/OAuthClient'),
        OAuthAccessToken = require('./OAuthModels/OAuthAccessToken'),
        OAuthRefreshToken = require('./OAuthModels/OAuthRefreshToken');

    let createUser = (data) => {
        return new blueBirdPromise((resolve, reject) => {
            if (!data) {
                reject(new Error('Invalid Parameters'));
            }
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

    let createOAuthClient = (data) => {
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

    let getClient = (user) => {
        return new blueBirdPromise((resolve, reject) => {
            if (!user) {
                reject(new Error('Invalid Parameters'));
            }
            OAuthClient.findOne({User: user}, (err, client) => {
                if (err)
                    reject(err);
                else
                    resolve(client);
            });
        });
    };

    let getUser = (username, password) => {
        return new blueBirdPromise((resolve, reject) => {
            if (!username || !password) {
                reject(new Error('Invalid Parameters'));
            }
            User.findOne({username: username, password: password}, (err, user) => {
                if (err) {
                    reject(new Error(err));
                }
                else if (user) {
                    resolve(user);
                } else {
                    reject(new Error('401'));
                }
            })
        });
    };

    let deleteUserTokens = (user) => {
        return new blueBirdPromise((resolve, reject) => {
            if (!user) {
                reject(new Error('Invalid Parameters'));
            }
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