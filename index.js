// Required node modules
require('dotenv').config() // provide access to variables inside .env file
let express = require('express')
let flash = require('connect-flash')
let layouts = require('express-ejs-layouts')
let session = require('express-session')
// Declare express app variable
let app = express()

// Set up and middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(express.urlencoded({ extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET
}))
app.use(flash()) // Depends on session; must come after it

//Custom middleware
app.use((req, res, next) => {
    res.locals.alerts = req.flash()
    next()
})
// Add any controllers
app.use('/auth', require('./controllers/auth'))
// Add home or catch-all routes
app.get('/', (req, res) => {
    res.render('home')
})
app.get('*', (req, res) => {
    res.render('error404')
})

app.listen(process.env.PORT || 3002, () => {
    console.log('You are connected on port 3002')
})