const auth = require('../config/auth');
const router = require('express').Router();

module.exports = function({ upload, app, grid, data, database, userMiddleware }) {
    let controller = require('../controllers/campaign-controller')({ grid, data, database });

    router
        .get('/', controller.getAll)
        .get('/create', auth.isAuthenticated, controller.getCreateForm)
        .post('/create', auth.isAuthenticated, upload.single('avatar'), controller.create)
        .get('/campaign/:id', controller.getById)
        .post('/campaign/:id', auth.isAuthenticated, controller.createComment)
        .put('/campaign/vote/:id', auth.isAuthenticated, controller.vote)
        .get('/campaign/picture/:id', controller.getPicture)
        .get('/campaign/category/:name', controller.getByCategory)
        .post('/donate/:id', auth.isAuthenticated, controller.donate)
        .get('/api', controller.getJson)
        .get('/search', controller.search);
    // .get('/api/comments/:id', controller.getCommentsJson);

    app.use(userMiddleware.hasLoggedUser);
    app.use('/campaigns', router);
};