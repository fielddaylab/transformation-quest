
export default class MockCollectionEndpoint {
    startedSessionCount = 0
    selectedLevels = []
    runEvents = []

    startSession() {
        this.startedSessionCount++
    }

    startLevel(levelModel) {
        this.selectedLevels.push(levelModel.id)
    }

    runLevel(startLevelModel, endLevelModel) {
        this.runEvents.push({type: 'runLevel', startLevelModel, endLevelModel})
    }

    endSession() {
    }
}
