const { Router } = require('express');
const invalidPathRouter = Router();

invalidPathRouter.use((req, res) => {
    res.render('404');
})

module.exports = { invalidPathRouter }