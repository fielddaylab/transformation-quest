import errors from "./errors"
import { BlockQueue, LoopBlock, BLOCK_TYPES } from './blocks'
import _ from 'lodash'
import AxisRange from './axisRange'

import E11 from '../assets/OBSTACLE-SVGs/obstacleMonster1-1x1.svg'
import E21 from '../assets/OBSTACLE-SVGs/obstacleMonster2-1x1.svg'
import E31 from '../assets/OBSTACLE-SVGs/obstacleMonster3-1x1.svg'
import E41 from '../assets/OBSTACLE-SVGs/obstacleMonster3-1x1.svg'

import E12 from '../assets/OBSTACLE-SVGs/obstacleMonster1-2x2.svg'
import E22 from '../assets/OBSTACLE-SVGs/obstacleMonster2-2x2.svg'
import E32 from '../assets/OBSTACLE-SVGs/obstacleMonster3-2x2.svg'
import E42 from '../assets/OBSTACLE-SVGs/obstacleMonster3-2x2.svg'

import E13 from '../assets/OBSTACLE-SVGs/obstacleMonster1-3x2.svg'
import E23 from '../assets/OBSTACLE-SVGs/obstacleMonster2-3x2.svg'
import E33 from '../assets/OBSTACLE-SVGs/obstacleMonster3-3x2.svg'
import E43 from '../assets/OBSTACLE-SVGs/obstacleMonster3-3x2.svg'
import { logEvent } from "./reactLogger"
const oneByOnes = [E11, E21, E31, E41]
const twoByTwos = [E12, E22, E32, E42]
const threeByTwos = [E13, E23, E33, E43]

export const MEDALS = {
    bronze: 'bronze',
    silver: 'silver',
    gold: 'gold',
    none: 'noMedal'
}

export const REWARDS = {
    blue: 'blue',
    yellow: 'yellow'
}

// Sorted from largest to smallest
const validObstacleSizes = [
    { width: 3, height: 2, getImage: () => _.sample(threeByTwos) },
    { width: 2, height: 2, getImage: () => _.sample(twoByTwos) },
    { width: 1, height: 1, getImage: () => _.sample(oneByOnes) },
]

export default class LevelModel {

    constructor(obj) {
        this.id = obj.id
        this.number = obj.number
        this.playerToken = obj.step ? obj.playerToken.transformShape(obj.step) : obj.playerToken
        this.axisRange = obj.axisRange || new AxisRange({ minX: -10, maxX: 10, minY: -10, maxY: 10 })
        try {
            this.playerToken.assertWithinBounds(this.axisRange)
            this.error = obj.error
        }
        catch (error) {
            this.error = error
            this.playerToken = obj.playerToken
        }
        this.title = obj.title
        this.availableBlocks = obj.availableBlocks || Object.values(BLOCK_TYPES)
        this.description = obj.description
        this.creative = obj.creative
        this.blockQueue = obj.blockQueue || new BlockQueue()
        this.executionStep = obj.executionStep
        this.editLoop = obj.editLoop
        this.endGoal = obj.endGoal
        this.atEndGoal = this.endGoal && this.playerToken.matches(this.endGoal)
        this.winCondition = obj.winCondition || (({ atEndGoal }) => atEndGoal)
        this.stamps = (obj.stamps || []).map(stamp => ({ ...stamp, collected: stamp.collected || this.playerToken.matches(stamp) }))

        // Split up obstacles into valid size rectangles
        this.obstacles = (obj.obstacles || [])
            .flatMap(o => {
                const validObstacle = validObstacleSizes.find(({ width, height }) => width === o.width && height === o.height)
                if (validObstacle) return { ...o, img: o.img ? o.img : validObstacle.getImage() }

                var fillGrid = new Array(o.width)
                for (var i = 0; i < fillGrid.length; i++) fillGrid[i] = new Array(o.height)
                const brokenDownShapes = []

                validObstacleSizes.forEach(({ width, height, getImage }) => {
                    const loopShapeArea = fn => {
                        for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) fn(x, y)
                    }
                    for (let x = 0; x <= o.width - width; x++) {
                        for (let y = 0; y <= o.height - height; y++) {
                            if (!fillGrid[x][y]) {
                                let canFit = true
                                loopShapeArea((xOff, yOff) => { if (fillGrid[x + xOff][y + yOff]) canFit = false })
                                if (canFit) {
                                    loopShapeArea((xOff, yOff) => fillGrid[x + xOff][y + yOff] = true)
                                    brokenDownShapes.push({ ...o, width, height, x: o.x + x, y: o.y - y, img: getImage() })
                                }
                            }
                        }
                    }
                })
                return brokenDownShapes
            })

        this.obstacleHit = this.obstacles.some(rect => this.playerToken.collidesWithRect(rect))
        const [contains, excludes] = _.partition(obj.rewards || [], reward => this.playerToken.doesContain(reward))
        this.rewards = excludes
        this.collectedRewards = contains.concat(obj.collectedRewards || [])
        this.medalCriteria = obj.medalCriteria || []
        this.acquiredMedals = obj.acquiredMedals || []
        this.complete = obj.complete || this.obstacleHit || this.error
        this.numberOfBlocksUsed = this.blockQueue.queue.reduce((count, block) => count + (block.type === BLOCK_TYPES.repeat ? (block.blockQueue.queue.length + 1) : 1), 0)
        if (this.medalCriteria && this.won) {
            const medalMatch = _.findLast(this.medalCriteria, medalCriteria => medalCriteria.attained(this))
            if (medalMatch) {
                this.medal = medalMatch.medal // highest attained medal
                if (!this.acquiredMedals.includes(this.medal)) this.acquiredMedals = [this.medal, ...this.acquiredMedals]
            }
        }
    }

    get numberOfMoves() {
        return (this.executionStep === undefined) ? 0 : this.executionStep + 1
    }

    get won() {
        return this.winCondition(this) && !this.error && this.complete && !this.obstacleHit
    }

    addBlock(block) {
        if (block.type !== BLOCK_TYPES.repeat && !this.availableBlocks.includes(block.type)) {
            throw new Error('Bad, you are not allowed to add a block of type: ' + block.id + ' because this level model only has these allowed blocks: ' + this.availableBlocks)
        }
        let blockQueue = this.blockQueue
        if (this.editLoop) this.editLoop.addBlock(block)
        else blockQueue = this.blockQueue.addBlock(block)
        return new LevelModel({ ...this, blockQueue, editLoop: block.type === BLOCK_TYPES.repeat ? block : this.editLoop })
    }

    removeBlockAt(index) {
        return new LevelModel({ ...this, blockQueue: this.blockQueue.removeBlockAt(index), editLoop: null })
    }

    replaceBlockQueue(queue) {
        return new LevelModel({ ...this, blockQueue: queue })
    }

    setEditLoop(loopBlock) {
        return new LevelModel({ ...this, editLoop: loopBlock })
    }

    numberOfGemsCollected(type) {
        return REWARDS[type] && this.collectedRewards.filter((reward) => reward.type === type).length
    }

    getStampScore() {
        return this.stamps.reduce((score, nextStamp) => (nextStamp.collected ? (score + nextStamp.value) : score), 0)
    }

    rootMatches(toMatch) {
        return toMatch.length === this.blockQueue.queue.length && toMatch.every((match, i) => this.blockQueue.queue[i] instanceof match)
    }

    numberOfInstructionsOutsideOfLoopLessThan(value) {
        return this.blockQueue.queue.reduce((count, block) => count + (block.type === BLOCK_TYPES.repeat ? 0 : 1), 0) < value
    }

    numberOfInstructionsLessThan(value) {
        return this.numberOfBlocksUsed < value
    }

    numberOfRootInstructionsOfType(type) {
        return this.blockQueue.queue.filter(block => block instanceof type).length
    }

    containsLoop() {
        return this.blockQueue.queue.some(block => block instanceof LoopBlock)
    }

    execute() {
        if (this.blockQueue.queue.length === 0) throw new Error(errors.noTransforms)
        const models = []
        let model = this
        const steps = this.blockQueue.getStepsFromQueue()
        for (let i = 0; i < steps.length && !model.complete; i++) {
            model = new LevelModel({ ...model, executionStep: i, step: steps[i], complete: i === steps.length - 1 })
            models.push(model)
        }
        return models
    }

}