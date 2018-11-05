const userRouter = (app) => {
    const userRouter = require('../../Routers/UserRouters/userRouter')();
    app.use('/user', userRouter);
};
module.exports = userRouter;
