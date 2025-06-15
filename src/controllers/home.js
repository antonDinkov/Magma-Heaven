const { Router } = require("express");
const { isUser, isOwner, hasVoted } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parseError } = require("../util");
const { create, getAll, getById, update, deleteById, vote } = require("../services/data");

//TODO replace with real router according to exam description
const homeRouter = Router();

homeRouter.get('/', (req, res) => {
    //This code creates a token and saves it in a cookie
    //const result = await login('John', '123456');
    //const token = createToken(result);
    //res.cookie('token', token)
    res.locals.title = 'Home';
    res.render('home');
})


homeRouter.get('/create', isUser(), (req, res) => {
    res.locals.title = 'Create';
    res.render('create');
});
homeRouter.post('/create', isUser(),
    body('name').trim().isLength({ min: 2 }).withMessage('The Name should be atleast 2 characters'),
    body('location').trim().isLength({ min: 2 }).withMessage('The Location should be atleast 2 characters'),
    body('elevation').trim().notEmpty().withMessage('Elevation is required').bail().isInt({ min: 0 }).withMessage('The Elevation should be minimum 0'),
    body('year').trim().notEmpty().withMessage('Year is required').bail().isInt({ min: 0, max: 2024 }).withMessage('The Year of Last Eruption should be between 0 and 2024 characters long'),
    body('image').trim().isURL({ require_tld: false }).withMessage('The volcano image should start with http:// or https://'),
    body('volcano').isIn(["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"]).withMessage('The Type should be select between ["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"]'),
    body('description').trim().isLength({ min: 10 }).withMessage('The Description should be atleast 10 characters long'),
    async (req, res) => {
        const { name, location, elevation, year, image, volcano, description } = req.body;
        try {
            const validation = validationResult(req);
            if (!validation.isEmpty()) {
                throw validation.array();
            }

            const authorId = req.user._id;

            const result = await create(req.body, authorId);

            res.redirect('/catalog');
        } catch (err) {
            res.render('create', { data: { name, location, elevation, year, image, volcano, description }, errors: parseError(err).errors })
        }
    });

homeRouter.get('/catalog', async (req, res) => {
    res.locals.title = 'Catalog';
    const volcanoes = await getAll();
    res.render('catalog', { volcanoes });
});

homeRouter.get('/catalog/:id', async (req, res) => {
    
    const id = req.params.id;
    const volcanoData = await getById(id);

    res.locals.title = `Details ${volcanoData.name}`;

    let voteCount = volcanoData.voteList.length;

    if (!volcanoData) {
        res.render('404');
        return;
    };

    const isLoggedIn = req.user;
    const isAuthor = req.user?._id == volcanoData.author.toString();
    const hasVoted = Boolean(volcanoData.voteList.find(id => id.toString() == req.user?._id));

    res.render('details', { volcanoData, voteCount, isLoggedIn, isAuthor, hasVoted });
});


homeRouter.get('/catalog/:id/edit', isOwner(), async (req, res) => {
    try {
        const volcanoData = await getById(req.params.id);

        res.locals.title = `Edit ${volcanoData.name}`;

        if (!volcanoData) {
            res.render('404');
            return;
        };

        res.render('edit', { volcanoData });
    } catch (err) {
        console.error('Error loading edit form: ', err);
        res.redirect('/404');
    }
});
homeRouter.post('/catalog/:id/edit', isOwner(),
    body('name').trim().isLength({ min: 2 }).withMessage('The Name should be atleast 2 characters'),
    body('location').trim().isLength({ min: 2 }).withMessage('The Location should be atleast 2 characters'),
    body('elevation').trim().isEmpty().withMessage('Elevation is required').bail().isInt({ min: 0 }).withMessage('The Elevation should be minimum 0'),
    body('year').trim().isEmpty().withMessage('Year is required').bail().isInt({ min: 0, max: 2024 }).withMessage('The Year of Last Eruption should be between 0 and 2024 characters long'),
    /* body('image').trim().notEmpty().withMessage('Image path is required').bail().custom(value => {
    if (!value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('/')) {
      throw new Error('Image URL must start with http://, https:// or /');
    }
    return true;
  }), */
                                        /* tld = Top Level Domain */
    body('image').trim().isURL({ require_tld: false }).withMessage('The volcano image should start with http:// or https://'),
    body('volcano').isIn(["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"]).withMessage('The Type should be select between ["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"]'),
    body('description').trim().isLength({ min: 10 }).withMessage('The Description should be atleast 10 characters long'),
    async (req, res) => {
        const volcanoData = await getById(req.params.id);
        try {
            const validation = validationResult(req);

            if (!validation.isEmpty()) {
                throw validation.array();
            }

            if (!volcanoData) {
                res.render('404');
                return;
            };

            const newRecord = await update(req.params.id, req.user._id, req.body);
            res.redirect(`/catalog/${req.params.id}`);
        } catch (err) {
            res.render('edit', { volcanoData, errors: parseError(err).errors });
        }
    });

    homeRouter.get('/catalog/:id/delete', isOwner(), async (req, res) => {
        try {
            const id =req.params.id;
            const userId = req.user._id;
            await deleteById(id, userId);
            res.redirect('/catalog');
        } catch (err) {
            console.log(error);
            
            res.render('404');
        }
    });

    homeRouter.get('/catalog/:id/vote', hasVoted(), async (req, res) => {
        try {
            await vote(req.params.id, req.user._id);
            res.redirect(`/catalog/${req.params.id}`);
        } catch (err) {
            console.log(err);
            res.render('404');
        }
    });

    homeRouter.get('/search', async (req, res) => {
        res.locals.title = 'Search';
        const { search = '', volcano = ''} = req.query;
        let volcanoes = await getAll();

        if (search) {
            volcanoes = volcanoes.filter(volc => volc.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (volcano) {
            volcanoes = volcanoes.filter(volc => volc.volcano == volcano);
        }

        res.render('search', { volcanoes, search, volcano });
    });
    

module.exports = { homeRouter };