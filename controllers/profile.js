let router = require('express').Router()
let isAdminLoggedIn = require('../middleware/isAdminloggedIn')
let isLoggedIn = require('../middleware/isLoggedIn')
let db = require('../models')
let async = require('async')

router.get('/', isLoggedIn, (req, res) => {
    //Need to list teams
    db.user.findOne({
        where: {id: req.user.id}, 
        include: [db.teams]
    })
    .then((user) => {
    
    res.render('profile/main', { teams: user.teams})
    console.log(user)
    })
})

router.get('/:id', (req, res) => {
    
    db.teams.findOne({
        where: {id: req.params.id},
        include: [db.members, db.roles]
    })
    .then(team => {
        db.members.findAll()
        db.roles.findAll()
        .then((members, roles) => {
            res.render('profile/show', { team, members, roles})
            
        })
    })
})

router.get('/admin', isAdminLoggedIn, (req, res) => {
    res.render('profile/admin')
})


//Get /profile/newTeam - display form for creating a new team
router.get('/newTeam', (req, res) => {
    res.render('profile/newTeam')
})

//POST /profile/newTeam - create a new team
router.post('/newTeam', (req, res) => {
    db.teams.create({
        name: req.body.name
    })
})

//GET /profile/:teamId/newMember -- create a new member in that team
router.get('/:id/newMember', (req, res) => {
    db.teams.findOne({
        where: {id: req.params.id},
        include: [db.roles]
    })
    .then(team => {
        db.roles.findAll()
        .then((roles) => {
            roles.forEach(role => {
                console.log(`LoGgInG ${role.id}`)
            })
            res.render('profile/newMember', { team, roles })
        })
    })
})
// POST /profile/:teamId/newMember -- awjdkawjdwja
router.post('/:id/newMember', (req, res) => {
    console.log(req.body.name)
    db.members.create({
        name: req.body.memberName,
        roleId: req.body.roleId,
        teamId: req.params.id
    })
    .then(() => {
        res.redirect(`/profile/${req.params.id}`)
    })
    .catch(err => {
        console.log(err)
    })
})
//Get /profile/:teamId/newRole -- create a new role in that team
router.get('/:id/newRole', (req, res) => {
    db.teams.findOne({
        where: {id: req.params.id},
        include: [db.roles]
    })
    .then(team => {
        db.roles.findAll()
        .then((roles) => {
            res.render('profile/newRole', {team, roles})
        })
    })
})

//POST /profile/:teamId/newRole -- Add a new role to your team
router.post('/:id/newRole', (req, res) => {
    db.roles.create({
        name: req.body.roleName,
        icon: req.body.roleIcon,
        teamId: req.params.id
    })
    .then(() => {
        res.redirect(`/profile/${req.params.id}`)
    })
        .catch(err => {
        console.log(err)
    })
})

module.exports = router