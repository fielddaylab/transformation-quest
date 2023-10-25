import React from 'react'
import { LogEvent, OGDLogger, OGDLogConsts } from 'opengamedata-js-log'
import { FirebaseConsts } from "./FBConfig";

export default class ReactLogger {
    constructor(obj) {
        this.ogdLogger = new OGDLogger("TRANSFORMATION_QUEST", "0.10")
        console.log("new ReactLogger created")
        this.ogdLogger.setDebug(true)
    }

    log(eventName, eventDetail) {
        this.ogdLogger.log(eventName, eventDetail)
    }
}

