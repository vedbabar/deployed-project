// const { Router } = require('express');
// const router = Router();
// const User = require('../models/user');

// router.get('/signin',(req,res)=>{
//     res.render('signin');
// })

// router.get('/signup',(req,res)=>{
//     res.render('signup');
// })

// router.post('/signin',async(req,res)=>{
//     const { email,password } =  req.body;
//     try {
//         const token = await User.matchPasswordAndGenerateToken(email, password);

//         return res.cookie('token',token).redirect('/')
        
//     } catch (error) {
//         return res.render('signin',{
//             error: 'Incorrect email or password',
//         });
//     }
// })

// router.post('/signup',async(req,res)=>{
//     const {fullName,email,password} = req.body;
//     await User.create({
//         fullName,
//         email,
//         password,
//     });
//     return res.redirect('/');
// })

// module.exports = router;


const { Router } = require('express');
const router = Router();
const User = require('../models/user'); // Ensure this model has methods like `matchPasswordAndGenerateToken`

// GET /signin - Render the sign-in page
router.get('/signin', (req, res) => {
    res.render('signin',{
        user: req.user || null,  
        error: null ,
    });
});

// GET /signup - Render the sign-up page
router.get('/signup', (req, res) => {
    res.render('signup',{
        user: req.user,
    });
});

// POST /signin - Authenticate user and issue a token
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Match password and generate token
        const token = await User.matchPasswordAndGenerateToken(email, password);

        // Set token as a cookie and redirect to the homepage
        return res.cookie('token', token, { httpOnly: true }).redirect('/');
    } catch (error) {
        console.error('Error in /signin:', error.message); // Log the error for debugging

        // Render the sign-in page with an error message
        return res.render('signin', {
            error: 'Invalid email or password',
            user: null,
        });
    }
});

// POST /signup - Create a new user
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Create the new user in the database
        const user = await User.create({
            fullName,
            email,
            password,
        });
        console.log(user);
        // Redirect to the homepage after successful signup
        return res.redirect('/');
    } catch (error) {
        console.error('Error in /signup:', error.message); // Log the error for debugging

        // Render the sign-up page with an error message
        return res.render('signup', {
            error: 'Failed to create an account. Please try again.',
        });
    }
});

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})

module.exports = router;
