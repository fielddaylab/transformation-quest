const fs = require('fs')
const request = require('supertest')
const tmp = require('tmp')
const app = require('../index')
const sessionData = require('../sessionData')

tmp.setGracefulCleanup()

describe('Data Collection service', () => {
    let sessionId
    let dataDirectory

    beforeEach((done) => {
        sessionId = null
        done()
    })

    beforeEach((done) => {
        let dir = tmp.dirSync({prefix: 'test-data-', unsafeCleanup: true})
        dataDirectory = dir.name
        sessionData.setDataDirectory(dir.name)
        done()
    })

    it('gets a session code', () => {
        return request(app)
            .get('/api/newSession')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                expect(res.body.sessionId).toBeDefined()
            }) 
        }
    )

    it('gets a new session code on each call', () => {
        let firstSession
        return request(app)
            .get('/api/newSession')
            .then((res) => {
                firstSession = res.body.sessionId
            }) 
            .then(() => request(app).get('/api/newSession'))
            .then((res) => {
                let nextSession = res.body.sessionId
                expect(nextSession).not.toBe(firstSession)
            })
    })

    function startSession() {
        return request(app)
            .get('/api/newSession')
            .then((res) => {
                sessionId = res.body.sessionId
            })
    }

    it('creates a file for a session', () => {
        return startSession() 
            .then(() => {
                let expectedFilename=dataDirectory +'/'+sessionId
                expect(fs.existsSync(expectedFilename)).toBeTruthy()
            })

    })

    it('loads an empty session', () => {
        return startSession() 
            .then(() => {
                let session = sessionData.loadSession(sessionId)
                expect(session.events.length).toBe(0)

            })
    })

    it('saves a level start', () => {
        return startSession() 
            .then(() => 
                request(app).post('/api/startLevel')
                    .send({ sessionId, levelModel: { description: 'this is a test level'} })
                    .expect(200)
            )
            .then(() => {
                    let session = sessionData.loadSession(sessionId)
                    expect(session.events.length).toBe(1)
                    expect(session.events[0].type).toBe('startLevel')
                    expect(session.events[0].timestamp).toBeDefined()
                    expect(session.events[0].levelModel).toBeDefined()
                    expect(session.events[0].levelModel.description).toBe('this is a test level')
                })
    })

    it('saves a level run', () => {
        return startSession() 
            .then(() => 
                request(app).post('/api/runLevel')
                    .send({ sessionId, 
                        startLevelModel: { description: 'this is a test level' },
                        endLevelModel: { description: 'this is a test level', complete: true, executionStep: 23} 
                    })
                    .expect(200)
            )
            .then(() => {
                    let session = sessionData.loadSession(sessionId)
                    expect(session.events.length).toBe(1)
                    expect(session.events[0].type).toBe('runLevel')
                    expect(session.events[0].timestamp).toBeDefined()
                    expect(session.events[0].startLevelModel).toBeDefined()
                    expect(session.events[0].endLevelModel.complete).toBeTruthy()
                })
    })

    it('recovers a player session', () => {
        return startSession() 
            .then(() => 
                request(app).post('/api/runLevel')
                    .send({ sessionId, 
                        startLevelModel: { description: 'this is a test level' },
                        endLevelModel: { description: 'this is a test level', complete: true, executionStep: 23} 
                    })
                    .expect(200)
            )
            .then(() => request(app).get('/api/session/'+sessionId))
            .then((response) => {
                let session = response.body
                expect(session.events.length).toBe(1)
                expect(session.events[0].type).toBe('runLevel')
                expect(session.events[0].timestamp).toBeDefined()
                expect(session.events[0].startLevelModel).toBeDefined()
                expect(session.events[0].endLevelModel.complete).toBeTruthy()
            })
    })

    it('gives a 404 if there is no session by that name', () => {
        return request(app).get('/api/session/aSessionThatDoesNotExist')
            .then((response) => {
                expect(response.status).toBe(404)
            })
    })

})
