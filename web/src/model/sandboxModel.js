import * as Transforms from "./math"
import AxisRange from './axisRange'

export default class SandboxModel {

    constructor(obj) {
        this.axisRange = obj.axisRange || new AxisRange({ minX: -10, maxX: 10, minY: -10, maxY: 10 })
        this.playerToken = obj.playerToken
        this.playerToken.assertWithinBounds(this.axisRange)
    }

    translateX({ dx }) {
        const transform = Transforms.createTranslation({ dx, dy: 0 })
        return new SandboxModel({ ...this, playerToken: this.playerToken.transformShape(transform) })
    }

    translateY({ dy }) {
        const transform = Transforms.createTranslation({ dx: 0, dy })
        return new SandboxModel({ ...this, playerToken: this.playerToken.transformShape(transform) })
    }

    rotate({ angle, point }) {
        if (!point) point = { x: 0, y: 0 }
        const transform = Transforms.compose(
            Transforms.createTranslation({ dx: -point.x, dy: -point.y }),
            Transforms.createRotation({ angle }),
            Transforms.createTranslation({ dx: point.x, dy: point.y })
        )
        return new SandboxModel({ ...this, playerToken: this.playerToken.transformShape(transform) })
    }

    reflect({ axis }) {
        const transform = Transforms.createReflection({ axis })
        return new SandboxModel({ ...this, playerToken: this.playerToken.transformShape(transform) })
    }

}