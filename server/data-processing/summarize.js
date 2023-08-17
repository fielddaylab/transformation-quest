const fs = require('fs')
const path = require('path')
const { rewardCount, padStrings, formatBlock, formatBlocks } = require('./summarizers')

summaryRows = []

function loadSession(sessionFile) {
    let raw = fs.readFileSync(sessionFile)
    return JSON.parse(raw)
}

function dumpSummary(fields) {
    function summaryHeader() { return fields.reduce((accum, name, index) => accum + (index ? ',' : '') + name, '') }
    function formatRow(summary) { return fields.reduce((accum, fieldName, index) => accum + (index ? ',' : '') + summary[fieldName], '') }
    console.log(summaryHeader())
    summaryRows.forEach((summary) => console.log(formatRow(summary)))
}

function summarize(session) {
    let levelId
    let attemptStartTime
    const previousAttempts = {}
    session.events.forEach(event => {
        switch (event.type) {
            case 'startLevel': {
                levelId = event.levelModel.id
                attemptStartTime = new Date(event.timestamp)
                if (previousAttempts[levelId] === undefined) {
                    previousAttempts[levelId] = {
                        attemptNumber: 0,
                        blockQueue: { queue: [] },
                        numberOfBlocksUsed: 0
                    }
                }
                break
            }
            case 'runLevel': {
                let attemptEndTime = new Date(event.timestamp)
                let attemptSeconds = (attemptEndTime.getTime() - attemptStartTime.getTime()) / 1000
                const { executionStep: executionStepCount, numberOfBlocksUsed, medal, obstacleHit, error, collectedRewards, stamps, blockQueue } = event.endLevelModel
                let previousAttempt = previousAttempts[levelId]
                const summary = {
                    sessionId: session.id,
                    levelId,
                    attemptNumber: previousAttempt.attemptNumber + 1,
                    attemptSeconds,
                    attemptStartDate: padStrings('-', attemptStartTime.getFullYear(), attemptStartTime.getMonth() + 1, attemptStartTime.getDate()),
                    attemptStartTime: padStrings(':', attemptStartTime.getHours(), attemptStartTime.getMinutes(), attemptStartTime.getSeconds()),
                    executionStepCount,
                    numberOfBlocksUsed,
                    blocks: formatBlocks(blockQueue),
                    obstacleHit,
                    blueGems: rewardCount(collectedRewards, 'blue'),
                    yellowGems: rewardCount(collectedRewards, 'yellow'),
                    outOfBounds: !!error, medal: medal || 'none',
                    stampPoints: stamps.filter(stamp => stamp.collected).reduce((total, stamp) => total + stamp.value, 0),
                    previousBlocks: formatBlocks(previousAttempt.blockQueue),
                    previousNumberOfBlocksUsed: previousAttempt.numberOfBlocksUsed
                }
                summaryRows.push(summary)

                previousAttempt.attemptNumber++
                previousAttempt.blockQueue = blockQueue
                previousAttempt.numberOfBlocksUsed = numberOfBlocksUsed
                attemptStartTime = attemptEndTime
                break
            }
        }
    })
}

if (process.argv.length <= 2) {
    console.log('Usage: ' + __filename + ' <sessionDirectoryToSummarize>')
    process.exit(-1)
}

var sessionsFolder = process.argv[2];

fs.readdir(sessionsFolder, function (err, items) {
    items.forEach(item => {
        let sessionFile = path.join(sessionsFolder, item)
        if (fs.lstatSync(sessionFile).isFile()) {
            try { summarize(loadSession(sessionFile)) }
            catch (error) { console.log(error) }
        }
    })
    if (summaryRows.length) dumpSummary(Object.keys(summaryRows[0]))
})