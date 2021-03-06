// Required node modules
require('dotenv').config() // provide access to variables inside .env file
const express = require('express')
const flash = require('connect-flash')
const layouts = require('express-ejs-layouts')
const session = require('express-session')
const app = express()
const server = require('http').createServer(app);

const io = require('socket.io').listen(server);

//Array of previous lines drawn
var line_history = [];
let icon_history = [];

//Include passport configuration
let passport = require('./config/passportConfig')

// Set up and middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(express.urlencoded({ extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET
}))
app.use(flash()) // Depends on session; must come after it
app.use(passport.initialize()) // Depends on session; must come after it
app.use(passport.session()) // Depends on session; must come after it
//Custom middleware
app.use((req, res, next) => {
    res.locals.alerts = req.flash()
    res.locals.user = req.user
    next()
})

//Socket
io.on('connection', function (socket) {
    for (let i=0; i<line_history.length; i++) {
        socket.emit('draw_line', { line: line_history[i] })
    }
    for (let i=0; i<icon_history.length; i++) {
        socket.emit('member_icon', { icon: icon_history[i]})
        console.log(icon_history[i])
    }
   
    socket.on('draw_line', (data) => {
        // add received line to history
        line_history.push(data.line);
        //send line to all clients
        io.emit('draw_line', { line: data.line })
    })

    socket.on('member_icon', (data) => {
        icon_history.push(data.icon);
    
        io.emit('member_icon', { icon: data.icon })
    })
})

// Add any controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
// Add home or catch-all routes
app.get('/', (req, res) => {
    res.render('home')
})
//404 page
app.get('*', (req, res) => {
    res.render('error')
})
server.listen(process.env.PORT || 3002, () => {
    console.log('You are connected on port 3002')
})