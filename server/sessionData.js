let fs = require('fs')
let path = require('path')
const getEnv = require('./getEnv')
let codeGenerator = require('./codeGenerator');

let nextSession = 1
let dataDirectory = getEnv('DATA_DIRECTORY')

function setDataDirectory(newDirectory) {
    dataDirectory = newDirectory
}

function getSessionIdForSessionNumber(sessionNumber) {
    return codeGenerator()
    //return 'alpha-' + sessionNumber
}

function getSessionFile(sessionId) {
    console.log("Session ID: ", sessionId)
    return path.join(dataDirectory, sessionId)
}

function sessionFileExists(sessionId) {
    return fs.existsSync(getSessionFile(sessionId))
}

function getNewSession() {
    let nextSessionId = getSessionIdForSessionNumber(nextSession)
    while (sessionFileExists(nextSessionId)) {
        nextSession++
        nextSessionId = getSessionIdForSessionNumber(nextSession)
    }
    createSession(nextSessionId)
    return nextSessionId
}

function saveSession(sessionData) {
    let sessionFile = getSessionFile(sessionData.id)
    fs.writeFileSync(sessionFile, JSON.stringify(sessionData))
}

function loadSession(sessionId) {
    let sessionFile = getSessionFile(sessionId)
    let raw = fs.readFileSync(sessionFile)
    return JSON.parse(raw)
}

function createSession(sessionId) {
    let emptySession = { id: sessionId, events:[] }
    saveSession(emptySession)
}

module.exports = {
    setDataDirectory,
    getNewSession,
    loadSession,
    saveSession
}