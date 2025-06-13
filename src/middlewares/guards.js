const { getById } = require("../services/data");

function isUser() {
    return function (req, res, next) {
        if (!req.user) {
            res.redirect('/login');
        } else {
            next();
        }
    }
};

function isGuest() {
    return function (req, res, next) {
        if (req.user) {
            res.redirect('/');
        } else {
            next();
        }
    }
};

function isOwner() {
    return async function (req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        
        const volcano = await getById(req.params.id);

        ownerId = volcano.author.toString();

        if (req.user._id == ownerId) {
            next();
        } else {
            res.redirect(`/catalog/${req.params.id}`);
        }
    }
}

module.exports = {
    isUser,
    isGuest,
    isOwner
}