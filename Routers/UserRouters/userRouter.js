let userRouter = function () {
    let express = require('express'),
        userRouter = express.Router(),
        oAuthProvider = require('../../OAuth/OAuthController')(),
        authenticate = require('../../OAuth/authenticate');

    userRouter.route('/')
        .post(oAuthProvider.addUser);

    userRouter.route('/authenticate')
        .post(oAuthProvider.tokenProvider);

    // Authenticated API Call
    userRouter.use('/authenticatedCall', authenticate());
    userRouter.route('/authenticatedCall')
        .get((req, res) => {
            res.send({message: 'You Are Authenticated Authenticated'})
        });

    userRouter.use('/logout', authenticate());
    userRouter.route('/logout')
        .post(oAuthProvider.logoutUser);

    return userRouter;
};
module.exports = userRouter;
