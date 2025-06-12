const cookieParser = require('cookie-parser');
const express = require('express');
const { session } = require('../middlewares/session');

const secret = 'cookie secret'

function configExpress(app) {
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(secret));
    app.use(session());
    //TODO add session middleware

};

module.exports = { configExpress };