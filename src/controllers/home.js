const { Router } = require("express");
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parseError } = require("../util");
const { create, getAll, getById } = require("../services/data");

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
homeRouter.post('/create', isUser(), 
body('name').trim().isLength({ min: 2 }).withMessage('The Name should be atleast 2 characters'),
body('location').trim().isLength({ min: 2 }).withMessage('The Location should be atleast 2 characters'),
body('elevation').trim().isNumeric({ min: 0 }).withMessage('The Elevation should be minimum 0'),
body('year').trim().isNumeric({ min: 0, max: 2024 }).withMessage('The Year of Last Eruption should be between 0 and 2024 characters long'),
body('image').trim().isURL().withMessage('The volcano image should start with http:// or https://'),
body('volcano').isIn(["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"]).withMessage('The Type should be select between ["Supervolcanoes", "Submarine", "Subglacial", "Mud", "Stratovolcanoes", "Shield"]'),
body('description').trim().isLength({ min: 10 }).withMessage('The Description should be atleast 10 characters long'),
async (req, res) => {
    const { name, location, elevation, year, image, volcano, decription} = req.body;
    try {
        const validation = validationResult(req);
        if (!validation.isEmpty) {
            throw validation.array();
        }

        const authorId = req.user._id;

        const result = await create(req.body, authorId);

        res.redirect('/catalog');
    } catch (err) {
        res.render('create', { data: { name, location, elevation, year, image, volcano, decription }, errors: parseError(err).errors})
    }
});

homeRouter.get('/catalog', async (req, res) => {
    const volcanoes = await getAll();
    res.render('catalog', { volcanoes });
});

homeRouter.get('/catalog/:id', async (req, res) => {
    console.log('Test to see if render');
    
    const id = req.params.id;
    console.log('Before volcano data');
    
    const volcanoData = await getById(id);
    console.log('After volcano data: ', volcanoData);
    
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

module.exports = { homeRouter }