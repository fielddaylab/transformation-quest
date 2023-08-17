import errors from "./errors"

export default class AxisRange {

    minX = -10
    maxX = 10
    minY = -10
    maxY = 10

    constructor({ minX, maxX, minY, maxY }) {
        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
    }

    assertPointInRange({ x, y }) {
        if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) throw new Error(errors.outOfBounds)
    }

}




