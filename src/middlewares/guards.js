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

        const ownerId = volcano.author.toString();

        if (req.user._id == ownerId) {
            return next();
        } else {
            return res.redirect(`/catalog/${req.params.id}`);
        }
       /* try {
            if (!req.user) {
                return res.redirect('/login');
            }

            const volcano = await getById(req.params.id);
            if (!volcano) {
                return res.redirect('/404');
            }

            const ownerId = volcano.author.toString();

            if (req.user._id == ownerId) {
                return next();
            } else {
                return res.redirect(`/catalog/${req.params.id}`);
            }
        } catch (err) {
            console.error('Middleware error:', err);
            return res.redirect('/500');
        } */
    }
}

module.exports = {
    isUser,
    isGuest,
    isOwner
}