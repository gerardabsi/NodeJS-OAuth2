const routersProvider = (app) => {
    require('./userRoutersProvider/userRouterProvider')(app);
};
module.exports = routersProvider;
