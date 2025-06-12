const { Router } = require("express");
const { login } = require("../services/user");
const { createToken } = require("../services/jwt");

//TODO replace with real router according to exam description
const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    console.log(req.user);

    //This code creates a token and saves it in a cookie
    //const result = await login('John', '123456');
    //const token = createToken(result);
    //res.cookie('token', token)
    console.log(req.errors);
    

    
    res.render('home');
})

module.exports = { homeRouter }