import errors from "./errors"
import { BlockQueue, LoopBlock, BLOCK_TYPES, getSequenceData } from './blocks'
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
import { logEvent, updateState } from "./reactLogger"
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
        this.stepType = obj.stepType
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
        this.newRewards = contains || [];
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
        logEvent("select_new_block", {"block_type": block.type, "block_params": block.paramMap})
        if (block.type !== BLOCK_TYPES.repeat && !this.availableBlocks.includes(block.type)) {
            throw new Error('Bad, you are not allowed to add a block of type: ' + block.type + ' because this level model only has these allowed blocks: ' + this.availableBlocks)
        }
        if (this.editLoop && !this.blockQueue.queue.includes(this.editLoop)) {
            // editLoop exists but is not in the queue - don't add anything to it
            return this;
        }
        let blockQueue = this.blockQueue;
        let inLoop = false;

        let blockIndex = -1;
        if (this.editLoop) {
            this.editLoop.addBlock(block);
            inLoop = true;
            blockIndex = this.editLoop.blockQueue.queue.indexOf(block);
        } else {
            blockQueue = this.blockQueue.addBlock(block);
            blockIndex = blockQueue.queue.indexOf(block)
        }

        updateState({sequence_block_count: this.numberOfBlocksUsed}) 
        logEvent("add_new_block", {"block_index": blockIndex, "in_loop": inLoop, "block_type": block.type, "block_params": block.paramMap})
        logEvent("sequence_updated", {'sequence_elements': getSequenceData(blockQueue.queue)})
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

    gemJustCollected(type) {
        return REWARDS[type] && this.newRewards.some((reward) => reward.type === type)
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

    judgeOutcome() {
        if (this.won) return OUTCOME.GOAL;
        if (this.obstacleHit) return OUTCOME.MONSTER;
        if (this.error) return OUTCOME.OUT_OF_BOUNDS;
        if (this.newRewards) {
            if (this.gemJustCollected(REWARDS.blue)) return OUTCOME.GEM_BLUE;
            if (this.gemJustCollected(REWARDS.yellow)) return OUTCOME.GEM_YELLOW;
        }
        let newStamp = this.stamps.find(stamp => this.playerToken.matches(stamp));
        if (newStamp) {
            if (newStamp.value > 1) return OUTCOME.STAMP_2_POINT
            return OUTCOME.STAMP_1_POINT
        }
        return OUTCOME.NONE;
    }

    containsLoop() {
        return this.blockQueue.queue.some(block => block instanceof LoopBlock)
    }

    execute() {
        if (this.blockQueue.queue.length === 0) throw new Error(errors.noTransforms)
        const models = []
        let model = this
        let list = this.blockQueue.getStepsFromQueue();
        const steps = list.transforms;
        const stepTypes = list.types;
        for (let i = 0; i < steps.length && !model.complete; i++) {
            model = new LevelModel({ ...model, executionStep: i, step: steps[i], stepType: stepTypes[i], complete: i === steps.length - 1 })
            models.push(model)
        }
        return models
    }

}

const OUTCOME = {
    NONE: 'NONE',
    OUT_OF_BOUNDS: 'OUT_OF_BOUNDS',
    MONSTER: 'MONSTER',
    STAMP_1_POINT: 'STAMP_1_POINT',
    STAMP_2_POINT: 'STAMP_2_POINT',
    GEM_YELLOW: 'GEM_YELLOW',
    GEM_BLUE: 'GEM_BLUE',
    GOAL: 'GOAL'
}