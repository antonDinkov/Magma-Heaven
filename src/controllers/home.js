const { Router } = require("express");
const { login } = require("../services/user");
const { createToken } = require("../services/jwt");

//TODO replace with real router according to exam description
const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    //This code creates a token and saves it in a cookie
    //const result = await login('John', '123456');
    //const token = createToken(result);
    //res.cookie('token', token)
    res.render('home');
})

module.exports = { homeRouter }