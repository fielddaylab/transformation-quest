let sessionStarted = false
let currentLevel = undefined

let dataCollectionBaseUrl = process.env.REACT_APP_DATA_COLLECTION_BASE_URL

export class WebDataCollectionEndpoint {

    sessionId = undefined

    constructor(baseUrl) {
        this.baseUrl = baseUrl
        if (baseUrl) console.log('Player data collection enabled to ' + this.baseUrl)
    }

    startSession() {
        if (!this.baseUrl) return
        console.log('starting session in data collection')
        fetch(this.baseUrl + '/api/newSession')
        .then(res => res.json())
        .then((data) => {
            this.sessionId = data.sessionId
            if (currentLevel) this.startLevel(currentLevel)
        })
        .catch(console.log)
    }

    loadSession(sessionId) {
        if (!this.baseUrl) return Promise.reject(new Error("Data collection not enabled."))
        console.log('loading session in data collection with', sessionId)
        return fetch(this.baseUrl + '/api/session/' + sessionId)
        .then(res => {
            if (res.status === 404)  throw new Error("Not found.")
            return res
        })
        .then(res => res.json())
        .then((data) => {
            this.sessionId = data.id
            if (currentLevel) this.startLevel(currentLevel)
            return data
        })
    }

    startLevel(levelModel) {
        if (!this.baseUrl) return
        if (!this.sessionId) return
        console.log('starting level ' + levelModel.id)
        fetch(this.baseUrl + '/api/startLevel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({sessionId: this.sessionId, levelModel})
        })
        .then(res => res.json())
        .catch(console.log)
    }

    runLevel(startLevelModel, endLevelModel) {
        if (!this.baseUrl) return
        console.log('running level ' + startLevelModel.id)
        fetch(this.baseUrl + '/api/runLevel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({sessionId: this.sessionId, startLevelModel, endLevelModel})
        })
        .then(res => res.json())
        .catch(console.log)
    }

    endSession() {
        if (!this.baseUrl) return
    }
}

let endpoint = new WebDataCollectionEndpoint(dataCollectionBaseUrl)

export function setEndpoint(newEndpoint) {
    endpoint= newEndpoint
}

export function startDataCollectionSession() {
    if (endpoint && !sessionStarted) {
        endpoint.startSession()
        sessionStarted = true
    }
}

export function loadDataCollectionSession(sessionId){
    if (endpoint) {
        return endpoint.loadSession(sessionId)
    } else return Promise.reject(new Error("Data collection not enabled."))
}

export function logLevelInDataCollection(levelModel) {
    if (endpoint && (!currentLevel || (levelModel.id !== currentLevel.id))) {
        endpoint.startLevel(levelModel)
        currentLevel = levelModel
    }
}

export function logLevelRunInDataCollection(startLevelModel, endLevelModel) {
    if (endpoint) endpoint.runLevel(startLevelModel, endLevelModel)
}

export function getSessionId() {
    return endpoint ? endpoint.sessionId : undefined
}

export function endSession() {
    sessionStarted = false
    currentLevel = undefined
    if (endpoint) endpoint.endSession()
}