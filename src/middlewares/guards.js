const { getById, getByIdKey } = require("../services/data");

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
        /* if (!req.user) {
            return res.redirect('/login');
        }
        
        const volcano = await getById(req.params.id);

        const ownerId = volcano.author.toString();

        if (req.user._id == ownerId) {
            return next();
        } else {
            return res.redirect(`/catalog/${req.params.id}`);
        } */
        try {
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
        }
    }
};

function hasVoted() {
    return async function (req, res, next) {
        try {
            if (!req.user._id) {
                throw new Error("You need to be logged in");
            }

            const allVoters = await getByIdKey(req.params.id, 'voteList');
            const hasVoted = allVoters.map(v => v.toString()).includes(req.user._id.toString());
            console.log(hasVoted);
            
            if (!hasVoted) {
                next();
            } else {
                throw new Error("You have already voted");
            }
        } catch (err) {
            console.error('Vote guard error: ',err.message);
            
            res.redirect(`/catalog/${req.params.id}`);
        }

    }
}

module.exports = {
    isUser,
    isGuest,
    isOwner,
    hasVoted
}