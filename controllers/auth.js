// Create an express router object
let router = require('express').Router()

//Include  a reference to the models for db access
let db = require('../models')

//Reference to passport module
let passport = require('../config/passportConfig')

// Define the routes
router.get('/login', (req, res) => {
    res.render('auth/login')
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Yay, we logged in!',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid Credentials'
}))
router.get('/signup', (req, res) => {
    res.render('auth/signup', {data: {} })
})
router.post('/signup', (req, res, next) => {
    if (req.body.password !== req.body.password_verify) {
        //User's password verification doesn't match - probably a typo 
        req.flash('error', 'Passwords do not match!')
        res.render('auth/signup', { data: req.body, alerts: req.flash() })
    }
    else {
        //Attempt to find a user by their email. If not found, then create them
        db.user.findOrCreate({
            where: { email: req.body.email },
            defaults: req.body
        })
        .then(([user, wasCreated]) => {
            if (wasCreated) {
                //This is intended user action
                //Now autoomatically log in user to new acct
                passport.authenticate('local', {
                    successRedirect: '/profile',
                    successFlash: 'Yay, we logged in!',
                    failureRedirect: '/auth/login',
                    failureFlash: 'Invalid Credentials'
            })(req, res, next)
        }
            else {
                //The user already has an account (probably forgot)
                req.flash('error', 'Account already exists. Go Log in!')
                res.redirect('/auth/login')
            }
        })
        .catch(err => {
            console.log('Error when creating a user', err)
a

            //Check for validation errors (Okay for user to see)
            if (err.errors) {
                err.errors.forEach(e => {
                    if (e.type === 'Validation error') {
                        req.flash('error', e.message)
                    }
                })
            }
            else {
                req.flash('error', 'Something happened ???')
            }
            //General error
            res.redirect('/auth/signup')
        })
    }
    
})

router.get('/logout', (req, res) => {
    req.logout() //Throws away the session data of logged in user
    req.flash('success', 'Goodbye - see you later alligator xDD')
    res.redirect('/')
})



// Export the router object so we can include it in other files
module.exports = router

