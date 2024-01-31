import * as Transforms from './math'
import _ from 'lodash'

export class BlockQueue {
    queue

    constructor(queue) {
        this.queue = queue || []
    }

    get length() {
        return this.queue.length
    }

    addBlock(block) {
        return new BlockQueue([...this.queue, block])
    }

    removeBlock(blockToRemove) {
        return new BlockQueue(this.queue.filter(block => block !== blockToRemove))
    }

    removeBlockAt(index) {
        const newQueue = [...this.queue]
        newQueue.splice(index, 1)
        return new BlockQueue(newQueue)
    }

    getStepsFromQueue() {
        return _.flatMap(this.queue, block => block.getTransformSteps())
    }
}

export const getSequenceData = blockQueue => {
    let elements = []
    for(let block of blockQueue) {
        elements.push(getBlockData(block))
    }
    return elements;
}

export const getBlockData = block => {
    let data = {}
    data.block_id = block.id;
    data.block_type = block.type;
    if (block.type == BLOCK_TYPES.repeat) {
        data.loop_subelements = getSequenceData(block.blockQueue.queue);
    }
    data.block_params = block.paramMap;
    return data;
}

export const BLOCK_TYPES = {
    xTranslate: 'x-translate',
    yTranslate: 'y-translate',
    cwRotate: 'cw-rotate',
    cwRotateArg: 'cw-rotate-arg',
    ccwRotate: 'ccw-rotate',
    ccwRotateArg: 'ccw-rotate-arg',
    xReflect: 'x-reflect',
    yReflect: 'y-reflect',
    xReflectArg: 'x-reflect-arg',
    yReflectArg: 'y-reflect-arg',
    repeat: 'repeat',
}

const blockDescriptionMap = {
    [BLOCK_TYPES.xTranslate]: ["Horizontal translation by"],
    [BLOCK_TYPES.yTranslate]: ["Vertical translation by"],
    [BLOCK_TYPES.cwRotate]: ["Rotate CW 90°"],
    [BLOCK_TYPES.ccwRotate]: ["Rotate CCW 90°"],
    [BLOCK_TYPES.cwRotateArg]: ["CW rotate ", '90° around'],
    [BLOCK_TYPES.ccwRotateArg]: ["CCW rotate", '90° around'],
    [BLOCK_TYPES.xReflect]: ["Reflect Across", "X-Axis (Y=0)"],
    [BLOCK_TYPES.yReflect]: ["Reflect Across", "Y-Axis (X=0)"],
    [BLOCK_TYPES.xReflectArg]: ["Reflect Across Y="],
    [BLOCK_TYPES.yReflectArg]: ["Reflect Across X="],
    [BLOCK_TYPES.repeat]: ["Loop"],
}

export class Block {

    constructor({ transformGenerator, amounts, type }) {
        this.type = type
        this.transformGenerator = transformGenerator
        this.amounts = amounts || []
    }

    get description() {
        return blockDescriptionMap[this.type]
    }

    get paramMap() {
        let outParams = {}
        for (let i = 0; i < this.description.length; i++) {
            outParams[this.description[i]] = this.amounts[i]
        }
        return outParams;
    }


    getTransformSteps() {
        return [this.transformGenerator(...this.amounts.map(a => Number(a)))]
    }

    isAmountValid() {
        return this.amounts.map(a => a + '').every(a => a.match(/^-?[0-9]+$/g))
    }

}

export class LoopBlock {

    constructor({ amounts, blockQueue }) {
        this.type = BLOCK_TYPES.repeat
        this.amounts = amounts
        this.blockQueue = blockQueue || new BlockQueue()
    }

    get description() {
        return blockDescriptionMap[this.type]
    }

    get paramMap() {
        let outParams = {}
        for (let i = 0; i < this.description.length; i++) {
            outParams[this.description[i]] = this.amounts[i]
        }
        return outParams
    }

    getTransformSteps() {
        return _.flatMap(_.range(this.amounts[0]), () => this.blockQueue.getStepsFromQueue())
    }

    addBlock(block) {
        this.blockQueue = this.blockQueue.addBlock(block)
    }

    reorderBlocks(newBlocks) {
        return new LoopBlock({ ...this, blockQueue: new BlockQueue(newBlocks) })
    }

    getNumberOfInstructionsInLoop() {
        return this.blockQueue.length
    }

    getLoopAmount() {
        return this.amounts[0]
    }

    removeBlock(block) {
        return new LoopBlock({ ...this, blockQueue: this.blockQueue.removeBlock(block) })
    }

    isAmountValid() {
        return (this.amounts[0] + '').match(/^[0-9]+$/g) && this.amounts[0] >= 2
    }

}

export const createHorizontalTranslation = dx => new Block({
    type: BLOCK_TYPES.xTranslate,
    transformGenerator: amount => Transforms.createTranslation({ dx: amount, dy: 0 }),
    amounts: [dx]
})

export const createVerticalTranslation = dy => new Block({
    type: BLOCK_TYPES.yTranslate,
    transformGenerator: amount => Transforms.createTranslation({ dx: 0, dy: amount }),
    amounts: [dy]
})

export const createClockwise90DegreeRotation = () => new Block({
    type: BLOCK_TYPES.cwRotate,
    transformGenerator: () => Transforms.createRotation({ angle: -90 }),
})

export const createCounterClockwise90DegreeRotation = () => new Block({
    type: BLOCK_TYPES.ccwRotate,
    transformGenerator: () => Transforms.createRotation({ angle: 90 }),
})

export const createClockwise90DegreeRotationArg = () => new Block({
    type: BLOCK_TYPES.cwRotateArg,
    transformGenerator: (x, y) => Transforms.createPointRotation({ angle: -90, point: { x, y } }),
    amounts: [0, 0]
})

export const createCounterClockwise90DegreeRotationArg = () => new Block({
    type: BLOCK_TYPES.ccwRotateArg,
    transformGenerator: (x, y) => Transforms.createPointRotation({ angle: 90, point: { x, y } }),
    amounts: [0, 0]
})

export const createReflectX = () => new Block({
    type: BLOCK_TYPES.xReflect,
    transformGenerator: () => Transforms.createReflection({ axis: 'x' }),
})

export const createReflectY = () => new Block({
    type: BLOCK_TYPES.yReflect,
    transformGenerator: () => Transforms.createReflection({ axis: 'y' })
})

export const createReflectXWithLine = () => new Block({
    type: BLOCK_TYPES.xReflectArg,
    transformGenerator: y => Transforms.createReflection({ axis: 'x', point: { x: 0, y } }),
    amounts: [0]
})

export const createReflectYWithLine = () => new Block({
    type: BLOCK_TYPES.yReflectArg,
    transformGenerator: x => Transforms.createReflection({ axis: 'y', point: { x, y: 0 } }),
    amounts: [0]
})

export const createLoop = iterations => new LoopBlock({ amounts: [iterations] })
