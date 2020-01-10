let router = require('express').Router()
let isLoggedIn = require('../middleware/isLoggedIn')
let db = require('../models')
let methodOverride = require('method-override')

router.use(methodOverride('_method'))

router.get('/', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {id: req.user.id}, 
        include: [db.teams]
    })
    .then((user) => {
    res.render('profile/main', { teams: user.teams})
    })
})
//Get /profile/newTeam - display form for creating a new team
router.get('/newTeam',isLoggedIn, (req, res) => {
    res.render('profile/newTeam')
})

//POST /profile/newTeam - create a new team
router.post('/newTeam', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: { id: req.user.id }
    })
    .then(user => {
        user.createTeam({
            name: req.body.name
        })
        .then(data => {
            res.redirect('/')
        })
    })
})

router.get('/:id', isLoggedIn, (req, res) => {
    
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

router.put('/:id', isLoggedIn, (req, res) => {
    db.teams.findOne({
        where: {id: req.params.id}
    })
    .then(team => {
        console.log(req.body)
        team.update({
            name: req.body.putTeamName
        })
        .then(data => {
            res.redirect('/')
     })
    
    })
})
//GET /profile/:teamId/newMember -- create a new member in that team
router.get('/:id/newMember', isLoggedIn, (req, res) => {
    db.teams.findOne({
        where: {id: req.params.id},
        include: [db.roles]
    })
    .then(team => {
        db.roles.findAll()
        .then((roles) => {
            roles.forEach(role => {
            })
            res.render('profile/newMember', { team, roles })
        })
    })
})
// POST /profile/:teamId/newMember -- awjdkawjdwja
router.post('/:id/newMember', isLoggedIn, (req, res) => {
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
router.get('/:id/newRole', isLoggedIn, (req, res) => {
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
router.post('/:id/newRole', isLoggedIn, (req, res) => {
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

router.get('/:id/simulator', (req, res) => {
    db.teams.findOne({
        where: {id: req.params.id},
        include: [db.members, db.roles]
    })
    .then(team => {
        db.members.findAll()
        db.roles.findAll()
        .then((members, roles) => {
            res.render('profile/simulator', { team, members, roles})
            
        })
    })
})
//Delete a member from the team
router.delete('/:id', isLoggedIn, (req, res) => {
    db.teams.findOne({
        where: { id : req.params.id },
        include: [db.members]
    })
    .then(() => {
        db.members.destroy({ 
            where: { id: req.body.memberName }  
        })
    })
        .then(() => {
            res.redirect(`/profile/${req.params.id}`)
        })
    })

module.exports = router