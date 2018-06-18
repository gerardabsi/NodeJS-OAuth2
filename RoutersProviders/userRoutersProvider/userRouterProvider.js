let userRouter = (app) => {
    let userRouter = require('../../Routers/UserRouters/userRouter')();
    app.use('/user', userRouter);
};
module.exports = userRouter;
