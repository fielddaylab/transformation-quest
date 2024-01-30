import { OGDLogger } from 'opengamedata-js-log'
// import { FirebaseConsts } from "./FBConfig";

export class ReactOGDLogger {
    constructor(obj) {
        this.ogdLogger = new OGDLogger("transformation_quest", "0.10")
        console.log("new ReactLogger created?")
        // this.ogdLogger.useFirebase(FirebaseConsts)
        this.ogdLogger.setDebug(true)
    }

    /**
     * Writes an event to the buffer.
     * @param {string} eventName
     * @param {object?} eventParams
     */
    log(eventName, eventDetail) {
        // this.ogdLogger.log(eventName, eventDetail)
        console.log("OGD LOGGED: " + eventName);
        console.log(eventDetail)
    }
}

let logger = new ReactOGDLogger()

export function setLogger(newLogger) {
    logger = newLogger;
    return logger;
}

export function logEvent(eventName, eventDetail) {
    if (logger) {
        logger.log(eventName, eventDetail)
    } else {
        console.warn("logger not initialized")
    }
}