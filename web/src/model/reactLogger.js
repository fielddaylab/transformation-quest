import { OGDLogger } from 'opengamedata-js-log'
// import { FirebaseConsts } from "./FBConfig";

const isDev = process.env.REACT_APP_DEV

export class ReactOGDLogger {
    constructor(obj) {
        this.ogdLogger = new OGDLogger("transformation_quest", "0.10")
        // this.ogdLogger.useFirebase(FirebaseConsts)
        this.ogdLogger.setDebug(isDev)
    }

    /**
     * Writes an event to the buffer.
     * @param {string} eventName
     * @param {object?} eventParams
     */
    log(eventName, eventDetail) {
        if (isDev) {
            console.log("[OpenGameData] Would log event: " + eventName);
            console.log(eventDetail)
            //console.log(this.ogdLogger._gameState)
            // this.ogdLogger.log(eventName, eventDetail)
        } else {
            this.ogdLogger.log(eventName, eventDetail)
        }

    }

    updateState({level, level_shields, sequence_block_count}) {
        let obj = this.ogdLogger._gameState || {};
        // This is dumb, I'm sure there's a better way to do it
        if (level !== undefined) {
            obj.level = level;
        }
        if (level_shields !== undefined) {
            obj.level_shields = level_shields;
        }
        if (sequence_block_count !== undefined) {
            obj.sequence_block_count = sequence_block_count;
        }

        this.ogdLogger.setGameState(obj)
        if (isDev) {
            console.log("[OpenGameData] Updated gameState:");
            console.log(this.ogdLogger._gameState)
        }
    }
}

var logger;
const dataTimers = {};

export const TIMERS = {
    FEEDBACK: 'FEEDBACK',
    OBJECTIVES: 'OBJECTIVES',
    LEGEND: 'LEGEND',
    MISSION: 'MISSION'
}

export function setLogger(newLogger) {
    if (logger) {
        console.warn("[OpenGameData] Logger already initialized! Skipping setLogger...")
    }
    logger = newLogger;
    return logger;
}

export function logEvent(eventName, eventDetail) {
    if (!logger) {
        console.warn("[OpenGameData] Logger not initialized!")
        return;
    } 
    logger.log(eventName, eventDetail)
}

export function updateState(obj) {
    if (!logger) {
        console.warn("[OpenGameData] Logger not initialized!")
        return;
    }
    logger.updateState(obj);
}

export function logTime(timerName) {
    dataTimers[timerName] = Date.now();
}

export function secsSinceLast(timerName) {
    if (!dataTimers[timerName]) return 0;
    return (Date.now() - dataTimers[timerName])/1000
}