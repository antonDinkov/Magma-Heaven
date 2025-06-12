//TODO import routers

const { invalidPathRouter } = require("../controllers/404");
const { homeRouter } = require("../controllers/home");

function configRoutes(app) {
    app.use(homeRouter);
    //TODO register routers
    app.use(invalidPathRouter);
};

module.exports = { configRoutes };