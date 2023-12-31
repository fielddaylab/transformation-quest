import { OGDLogger } from 'opengamedata-js-log'
// import { FirebaseConsts } from "./FBConfig";

export default class ReactOGDLogger {
    constructor(obj) {
        this.ogdLogger = new OGDLogger("transformation_quest", "0.10")
        console.log("new ReactLogger created")
        // this.ogdLogger.useFirebase(FirebaseConsts)
        this.ogdLogger.setDebug(true)
    }

    log(eventName, eventDetail) {
        this.ogdLogger.log(eventName, eventDetail)
    }
}

