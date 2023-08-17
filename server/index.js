
let express = require('express')
let bodyParser = require('body-parser')

let sessionData = require('./sessionData')

let app = express() 

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/api/newSession', (req, res) => {
    try {
        let sessionId = sessionData.getNewSession()
        res.send({sessionId})    
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

app.post('/api/startLevel', (req, res) => {
    try {
        let sessionId = req.body.sessionId
        let levelModel = req.body.levelModel
        let session = sessionData.loadSession(sessionId)
        session.events.push({type: 'startLevel', timestamp: new Date().toString(), levelModel})
        sessionData.saveSession(session)
        res.send({allGood: true})    
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

app.post('/api/runLevel', (req, res) => {
    try {
        let sessionId = req.body.sessionId
        let startLevelModel = req.body.startLevelModel
        let endLevelModel = req.body.endLevelModel
        let session = sessionData.loadSession(sessionId)
        session.events.push({type: 'runLevel', timestamp: new Date().toString(), startLevelModel, endLevelModel })
        sessionData.saveSession(session)
        res.send({allGood: true})    
    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
})

app.get('/api/session/:sessionId', (req, res) => {
    try {
        let sessionId = req.params.sessionId
        let session = sessionData.loadSession(sessionId)
        res.send(session)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(404)
    }
})

// pull files from build and deploy locations
app.use(express.static('./game-web'))
app.use(express.static('../web/build'))

// Client side routing can cause random paths to appear on the serve side.  
// Send them all back to the opening page
app.use(function (req, res) {
    res.redirect('/')
})

module.exports = app
