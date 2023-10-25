import React from 'react'
import { OGDLogger } from 'opengamedata-js-log'

export default () => {
    this.ogdLogger = new OGDLogger("TRANSFORMATION_QUEST", "1.00")
    console.log("new OGDLogger created")
    ogdLogger.setDebug(true)

    this.log = (eventName, eventDetail) => {
        ogdLogger.log(eventName, eventDetail)
    }
}

