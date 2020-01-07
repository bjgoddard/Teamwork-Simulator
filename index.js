// Required node modules
require('dotenv').config() // provide access to variables inside .env file
const express = require('express')
const flash = require('connect-flash')
const layouts = require('express-ejs-layouts')
const session = require('express-session')
const app = express()
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
const server = require('http').createServer(app);

const io = require('socket.io').listen(server);

//Array of previous lines drawn
var line_history = [];



// Declare express app variable


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


//Socket2
io.on('connection', function (socket) {

    //Change to for loop?
    for (var i in line_history) {
        socket.emit('draw_line', { line: line_history[i] })
    }
    // add handler for message type draw_line
    socket.on('draw_line', (data) => {
        // add received line to history
        line_history.push(data.line);
        //send line to all clients
        io.emit('draw_line', { line: data.line })
    })
})




// //Socket.io
// function onConnection(socket){
    
//     socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
    
//   }
  
//   io.on('connection', onConnection);





// Add any controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
// Add home or catch-all routes
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/simulator', (req, res) => {
    res.render('simulator')
})
//404 page
app.get('*', (req, res) => {
    res.render('error')
})


server.listen(process.env.PORT || 3002, () => {
    console.log('You are connected on port 3002')
})