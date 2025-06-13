const { Router } = require("express");
const { isUser } = require("../middlewares/guards");

//TODO replace with real router according to exam description
const homeRouter = Router();

homeRouter.get('/', (req, res) => {
    //This code creates a token and saves it in a cookie
    //const result = await login('John', '123456');
    //const token = createToken(result);
    //res.cookie('token', token)
    res.render('home');
})


homeRouter.get('/create', isUser(), (req, res) =>{
    res.render('create');
});
homeRouter.post('/create', isUser(), (req, res) => {

});

module.exports = { homeRouter }