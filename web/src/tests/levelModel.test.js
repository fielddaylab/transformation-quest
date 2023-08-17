import LevelModel, { MEDALS, REWARDS } from '../model/levelModel'
import './assertions'
import errors from "../model/errors"
import { Polygon, Circle, sortVertices } from '../model/shapes'
import * as Blocks from '../model/blocks'
import { BLOCK_TYPES } from '../model/blocks'

describe("Level Model", () => {

    let levelModel
    let endPolygon = [{ x: 0, y: 5 }, { x: 0, y: 8 }, { x: -3, y: 8 }]
    let playerPolygon = [{ x: 3, y: 5 }, { x: 3, y: 8 }, { x: 0, y: 8 }]

    beforeEach(() => {
        levelModel = new LevelModel({
            endGoal: new Polygon(endPolygon),
            playerToken: new Polygon(playerPolygon),
        })
    })

    test('Should set up level', () => {
        const availableBlocks = [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate]
        const newModel = new LevelModel({ ...levelModel, availableBlocks })
        let playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices).polygonEquals(playerPolygon)
        let endGoal = newModel.endGoal
        expect(endGoal instanceof Polygon).toBe(true)
        expect(endGoal.vertices).polygonEquals(endPolygon)
        expect(newModel.executionStep).toBe(undefined)
        expect(newModel.availableBlocks).toBe(availableBlocks)
    })

    test('Should allow all blocks if no avaialable blocks list is specified', () => {
        const newModel = new LevelModel({ ...levelModel })
        expect(newModel.availableBlocks).toStrictEqual(Object.values(BLOCK_TYPES))
    })

    describe('Block Queue Modification', () => {

        test('Should replace queue', () => {
            let transformationArray = [Blocks.createHorizontalTranslation(-2), Blocks.createVerticalTranslation(2)]
            const newQueue = new Blocks.BlockQueue(transformationArray)
            let newLevelModel = levelModel.replaceBlockQueue(newQueue)
            expect(newQueue).toEqual(newLevelModel.blockQueue)
        })

        test('Should add transform to end of queue', () => {
            expect(levelModel.blockQueue.length).toEqual(0)
            let newModel = levelModel.addBlock(Blocks.createHorizontalTranslation(-3))
            expect(newModel.blockQueue.length).toEqual(1)
        })

        test('Should add avaiable transform to end of queue', () => {
            const availableBlocks = [BLOCK_TYPES.xReflect]
            const newModel = new LevelModel({ ...levelModel, availableBlocks })
                .addBlock(Blocks.createReflectX())
            expect(newModel.blockQueue.length).toEqual(1)
        })

        test('Should not add transform to end of queue if not specified in "availableBlocks"', () => {
            const availableBlocks = [BLOCK_TYPES.yReflect]
            expect(() => {
                new LevelModel({ ...levelModel, availableBlocks }).addBlock(Blocks.createReflectX())
            }).toThrow()
        })

        test('Should remove transform from queue', () => {
            const testBlock = Blocks.createHorizontalTranslation(1)
            let fullModel = levelModel
                .addBlock(Blocks.createHorizontalTranslation(0))
                .addBlock(testBlock)
                .addBlock(Blocks.createHorizontalTranslation(2))
                .addBlock(Blocks.createHorizontalTranslation(3))

            expect(fullModel.blockQueue.length).toEqual(4)

            let removedModel = fullModel.removeBlockAt(1)
            expect(removedModel.blockQueue.length).toEqual(3)
            expect(removedModel.blockQueue.queue.indexOf(testBlock)).toEqual(-1)
        })

    })

    describe('Block Execution', () => {

        test('Should execute transforms in queue (no transform)', () => {
            expect(() => levelModel.execute()).toThrow(errors.noTransforms)
        })

        test('Should execute transforms in queue (single transform)', () => {
            let [newModel] = levelModel
                .addBlock(Blocks.createHorizontalTranslation(1))
                .execute()

            expect(newModel.executionStep).toBe(0)
            let playerToken = newModel.playerToken
            expect(playerToken instanceof Polygon).toBe(true)
            expect(playerToken.vertices.length).toBe(3)
            const expectedPos = [{ x: 4, y: 5 }, { x: 4, y: 8 }, { x: 1, y: 8 }]
            expect(playerToken.vertices).polygonEquals(expectedPos)
        })

        test('Should execute transforms in queue (multiple transform)', () => {
            let [step1, newModel] = levelModel
                .addBlock(Blocks.createCounterClockwise90DegreeRotation())
                .addBlock(Blocks.createHorizontalTranslation(1))
                .execute()

            expect(newModel.executionStep).toBe(1)
            let playerToken = newModel.playerToken
            expect(playerToken instanceof Polygon).toBe(true)
            expect(playerToken.vertices.length).toBe(3)
            const expectedPos = [{ x: -7, y: 0 }, { x: -7, y: 3 }, { x: -4, y: 3 }]
            expect(sortVertices(playerToken.vertices)).polygonEquals(expectedPos)
        })

        test('should end execution when you hit an obstacle', () => {
            let res =
                new LevelModel({
                    endGoal: new Polygon(endPolygon),
                    playerToken: new Polygon([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }]),
                    obstacles: [{ x: 0, y: 3, width: 2, height: 2 }],
                })
                    .addBlock(Blocks.createVerticalTranslation(1))
                    .addBlock(Blocks.createVerticalTranslation(1))
                    .addBlock(Blocks.createVerticalTranslation(1))
                    .addBlock(Blocks.createVerticalTranslation(1))
                    .execute()

            expect(res.length).toEqual(1)
            expect(res[0].obstacleHit).toEqual(true)
        })

    })

    describe('Level Completion', () => {

        test('Should fail if shape does not overlap end goal', () => {
            expect(levelModel.atEndGoal).toBeFalsy()
        })

        test('Should be able to move shape to end goal', () => {
            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-3)).execute()
            expect(newModel.atEndGoal).toBeTruthy()
        })

        test('Should move circle to goal', () => {
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 5 }),
                playerToken: new Circle({ x: 3, y: 5 }),
            })
            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-3)).execute()
            expect(newModel.atEndGoal).toBeTruthy()
        })

        test('Should win level with unordered polygon vertices', () => {
            levelModel = new LevelModel({
                endGoal: new Polygon([{ x: 0, y: 5 }, { x: 0, y: 8 }, { x: -3, y: 8 }]),
                playerToken: new Polygon([{ x: 0, y: 8 }, { x: 3, y: 5 }, { x: 3, y: 8 }]),
            })
            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-3)).execute()
            expect(newModel.atEndGoal).toBeTruthy()
        })

        test('Should complete level after execute', () => {
            levelModel = new LevelModel({
                endGoal: new Polygon([{ x: 0, y: 5 }, { x: 0, y: 8 }, { x: -3, y: 8 }]),
                playerToken: new Polygon([{ x: 0, y: 8 }, { x: 3, y: 5 }, { x: 3, y: 8 }]),
            })
            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-3)).execute()
            expect(newModel.complete).toBeTruthy()
        })

    })

    describe('Loops', () => {

        test('Should create a loop', () => {
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 5 }),
                playerToken: new Circle({ x: 3, y: 5 }),
            })
            let loop = Blocks.createLoop(3)
            levelModel = levelModel.addBlock(loop)
            levelModel.addBlock(Blocks.createHorizontalTranslation(-1))
            let intermediateSteps = levelModel.execute()
            expect(intermediateSteps.length).toEqual(3)
            expect(intermediateSteps[0].playerToken.x).toEqual(2)
            expect(intermediateSteps[1].playerToken.x).toEqual(1)
            expect(intermediateSteps[2].playerToken.x).toEqual(0)
            expect(intermediateSteps[2].atEndGoal).toBeTruthy()
        })

        test('Should delete a loop', () => {
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 5 }),
                playerToken: new Circle({ x: 3, y: 5 }),
            })
            let loop = Blocks.createLoop(3)
            levelModel = levelModel.addBlock(loop)
            levelModel.addBlock(Blocks.createHorizontalTranslation(-1))
            expect(levelModel.removeBlockAt(0).blockQueue.length).toEqual(0)
        })

        test('Should allow editing after removing a loop without popping', () => {
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 5 }),
                playerToken: new Circle({ x: 3, y: 5 }),
            })
            let loop = Blocks.createLoop(3)
            levelModel = levelModel.addBlock(loop)
            levelModel.addBlock(Blocks.createHorizontalTranslation(-1))

            levelModel = levelModel.removeBlockAt(0)
            expect(levelModel.blockQueue.length).toEqual(0)

            levelModel = levelModel.addBlock(Blocks.createHorizontalTranslation(-1))
            expect(levelModel.blockQueue.length).toEqual(1)
        })

        test('Should handle a loop out of bounds', () => {
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 5 }),
                playerToken: new Circle({ x: 3, y: 5 }),
            })
            levelModel = levelModel.addBlock(Blocks.createLoop(3))
            levelModel.addBlock(Blocks.createHorizontalTranslation(-5))
            let intermediateSteps = levelModel.execute()

            expect(intermediateSteps.length).toEqual(3)
            expect(intermediateSteps[0].playerToken.x).toEqual(-2)
            expect(intermediateSteps[1].playerToken.x).toEqual(-7)
            expect(intermediateSteps[2].error).toBeTruthy()
        })

        test('Should push multiple loops', () => {
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 5 }),
                playerToken: new Circle({ x: 3, y: 5 }),
            })
            let outerLoop = Blocks.createLoop(2)
            let innerLoop = Blocks.createLoop(3)

            levelModel = levelModel.addBlock(outerLoop)
                .addBlock(Blocks.createHorizontalTranslation(-1))
                .addBlock(innerLoop)
                .addBlock(Blocks.createVerticalTranslation(-1))

            let intermediateSteps = levelModel.execute()
            expect(intermediateSteps.length).toEqual(8)
            expect(intermediateSteps[0].playerToken.x).toEqual(2)
            expect(intermediateSteps[0].playerToken.y).toEqual(5)
            expect(intermediateSteps[1].playerToken.x).toEqual(2)
            expect(intermediateSteps[1].playerToken.y).toEqual(4)
            expect(intermediateSteps[2].playerToken.x).toEqual(2)
            expect(intermediateSteps[2].playerToken.y).toEqual(3)
            expect(intermediateSteps[3].playerToken.x).toEqual(2)
            expect(intermediateSteps[3].playerToken.y).toEqual(2)
            expect(intermediateSteps[4].playerToken.x).toEqual(1)
            expect(intermediateSteps[4].playerToken.y).toEqual(2)
            expect(intermediateSteps[5].playerToken.x).toEqual(1)
            expect(intermediateSteps[5].playerToken.y).toEqual(1)
            expect(intermediateSteps[6].playerToken.x).toEqual(1)
            expect(intermediateSteps[6].playerToken.y).toEqual(0)
            expect(intermediateSteps[7].playerToken.x).toEqual(1)
            expect(intermediateSteps[7].playerToken.y).toEqual(-1)
        })

        test('Should count a loop as 1 + n blocks', () => {
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 5 }),
                playerToken: new Circle({ x: 3, y: 5 }),
            })

            let outerLoop = Blocks.createLoop(2)

            levelModel = levelModel.addBlock(Blocks.createHorizontalTranslation(-1))
                .addBlock(outerLoop)
                .addBlock(Blocks.createHorizontalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))

            expect(levelModel.numberOfBlocksUsed).toEqual(6)
        })

    })

    describe('Scoring', () => {

        test('Should setup list of reward locations', async () => {
            const rewards = [{ type: REWARDS.blue, x: 0, y: 0 }, { type: REWARDS.blue, x: 1, y: 0 }, { type: REWARDS.blue, x: 3, y: 0 }, { type: REWARDS.blue, x: 5, y: 0 }]
            levelModel = new LevelModel({
                endGoal: new Polygon([{ x: 0, y: 5 }, { x: 0, y: 8 }, { x: -3, y: 8 }]),
                playerToken: new Polygon([{ x: 0, y: 8 }, { x: 3, y: 5 }, { x: 3, y: 8 }]),
                rewards
            })
            expect(levelModel.rewards).toEqual(expect.arrayContaining(rewards))
        })

        test('move player Circle over a reward location, should increment score and remove reward from list', async () => {
            const rewardToCollect = { type: REWARDS.blue, x: 0, y: 0 }
            levelModel = new LevelModel({
                endGoal: new Circle({ x: 10, y: 10 }),
                playerToken: new Circle({ x: 1, y: 0 }),
                rewards: [rewardToCollect]
            })

            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-1)).execute()
            expect(newModel.numberOfGemsCollected(REWARDS.blue)).toEqual(1)
            expect(newModel.rewards.length).toEqual(0)
        })

        test('move player Vertex of polygon over a reward location, should increment score and remove reward from list', async () => {
            const rewardToCollect = { type: REWARDS.yellow, x: 0, y: 0 }
            levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }]),
                rewards: [rewardToCollect]
            })

            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-1)).execute()
            expect(newModel.numberOfGemsCollected(REWARDS.yellow)).toEqual(1)
            expect(newModel.rewards.length).toEqual(0)
        })

        test('move player edge of polygon over a reward location, should increment score and remove reward from list', async () => {
            const rewardToCollect = { type: REWARDS.yellow, x: 0, y: 2 }
            levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: 1, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 1 }]),
                rewards: [rewardToCollect]
            })

            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-1)).execute()
            expect(newModel.numberOfGemsCollected(REWARDS.yellow)).toEqual(1)
            expect(newModel.rewards.length).toEqual(0)
        })

        test('winding of player polygon does not matter when collecting rewards', async () => {
            const rewardToCollect = { type: REWARDS.blue, x: 0, y: 2 }
            levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: 3, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 1 }]),
                rewards: [rewardToCollect]
            })

            let [newModel] = levelModel.addBlock(Blocks.createHorizontalTranslation(-1)).execute()
            expect(newModel.numberOfGemsCollected(REWARDS.blue)).toEqual(1)
            expect(newModel.rewards.length).toEqual(0)
        })

        test('move player to contain a reward location inside shape, should increment score and remove reward from list', async () => {
            const rewardToCollect = { type: REWARDS.blue, x: 2, y: 2 }
            levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 0 }]),
                rewards: [rewardToCollect]
            })

            let [newModel] = levelModel.addBlock(Blocks.createCounterClockwise90DegreeRotation()).execute()
            expect(newModel.numberOfGemsCollected(REWARDS.blue)).toEqual(1)
            expect(newModel.rewards.length).toEqual(0)
        })

        test('move player to contain a reward and move past it, should still collect', async () => {
            const rewardToCollect = { type: REWARDS.yellow, x: 2, y: 2 }
            levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 0 }]),
                rewards: [rewardToCollect]
            })

            let [step1, newModel] = levelModel
                .addBlock(Blocks.createCounterClockwise90DegreeRotation())
                .addBlock(Blocks.createCounterClockwise90DegreeRotation())
                .execute()

            expect(newModel.numberOfGemsCollected(REWARDS.yellow)).toEqual(1)
            expect(newModel.rewards.length).toEqual(0)
        })

        test('move player to collect multiple rewards, should increment and remove', async () => {
            const rewardToCollect = { type: REWARDS.blue, x: 2, y: 2 }
            const rewardToCollect2 = { type: REWARDS.yellow, x: 1, y: 1 }
            levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 0 }]),
                rewards: [rewardToCollect, rewardToCollect2]
            })

            let [newModel] = levelModel.addBlock(Blocks.createCounterClockwise90DegreeRotation()).execute()
            expect(newModel.numberOfGemsCollected(REWARDS.blue)).toEqual(1)
            expect(newModel.numberOfGemsCollected(REWARDS.yellow)).toEqual(1)

            expect(newModel.rewards.length).toEqual(0)
        })

    })

    describe('Medals', () => {

        const medalCriteria = [
            { medal: MEDALS.bronze, attained: levelModel => levelModel.collectedRewards.length > 2, description: 'Collect at least 2 rewards' },
            { medal: MEDALS.silver, attained: levelModel => levelModel.collectedRewards.length > 3, description: 'Collect at least 3 rewards' },
            { medal: MEDALS.gold, attained: levelModel => levelModel.collectedRewards.length > 4, description: 'Collect at least 4 rewards' },
        ]

        test('will create metals criteria', async () => {
            levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 0 }]),
                medalCriteria
            })

            expect(levelModel.medalCriteria).toEqual(expect.objectContaining(medalCriteria))
        })

        test('getMedal will get no medal if you don\'t meet any medal criteria', async () => {

            const levelModels = new LevelModel({
                endGoal: new Circle({ x: 0, y: 4 }),
                playerToken: new Circle({ x: 0, y: 5 }),
                medalCriteria
            })
                .addBlock(Blocks.createVerticalTranslation(-1))
                .execute()

            expect(levelModels[levelModels.length - 1].medal).toBeFalsy()
        })

        test('getMedal will get corrrect medal', async () => {

            const levelModels = new LevelModel({
                endGoal: new Circle({ x: 0, y: 0 }),
                playerToken: new Circle({ x: 0, y: 5 }),
                rewards: [{ x: 0, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 }],
                medalCriteria
            })
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .execute()

            expect(levelModels[levelModels.length - 1].medal).toEqual(MEDALS.silver)
        })

        test('When a new medal is obtained, it is added to the medals array', async () => {
            const levelModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 0 }),
                playerToken: new Circle({ x: 0, y: 5 }),
                rewards: [{ x: 0, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 }],
                acquiredMedals: [MEDALS.gold],
                medalCriteria
            })

            let [, , secondLastModel, endModel] = levelModel
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-1))
                .addBlock(Blocks.createVerticalTranslation(-2))
                .execute()

            expect(secondLastModel.acquiredMedals).not.toContain(MEDALS.bronze)

            expect(endModel.acquiredMedals).toContain(MEDALS.bronze)
            expect(endModel.acquiredMedals).toContain(MEDALS.gold)
        })

        describe('New medal criteria', () => {

            const levelModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon(playerPolygon),
            })

            test('Can test that there is only a specified amount of blocks in solution', async () => {
                let newModel = levelModel
                    .addBlock(Blocks.createVerticalTranslation(-1))
                    .addBlock(Blocks.createVerticalTranslation(-1))
                    .addBlock(Blocks.createVerticalTranslation(-1))
                expect(newModel.numberOfBlocksUsed).toEqual(3)
            })

            test('Can test that there is only a loop at the root', async () => {
                let newModel = levelModel
                    .addBlock(Blocks.createLoop(3))
                expect(newModel.rootMatches([Blocks.LoopBlock])).toBeTruthy()
            })

            test('Can test that there is a loop somewhere in the solution', async () => {
                let newModel = levelModel
                    .addBlock(Blocks.createVerticalTranslation(-1))
                    .addBlock(Blocks.createLoop(3))
                    .addBlock(Blocks.createCounterClockwise90DegreeRotation())
                expect(newModel.containsLoop()).toBeTruthy()
            })

            test('Can test that there is a maximum number of blocks at the root level', async () => {
                let newModel = levelModel
                    .addBlock(Blocks.createLoop(3))
                    .addBlock(Blocks.createVerticalTranslation(-1))
                    .addBlock(Blocks.createCounterClockwise90DegreeRotation())
                expect(newModel.numberOfBlocksUsed).toEqual(3)
                expect(newModel.numberOfInstructionsLessThan(4)).toBeTruthy()
            })

            test('Can test that there is a certain number of blocks at the root level of a given type', async () => {
                let newModel = levelModel
                    .addBlock(Blocks.createVerticalTranslation(-1))
                    .addBlock(Blocks.createLoop(3))
                    .addBlock(Blocks.createCounterClockwise90DegreeRotation())
                expect(newModel.numberOfRootInstructionsOfType(Blocks.LoopBlock)).toEqual(1)
            })
        })

    })

    describe('Obstacles', () => {

        test('will create obstacles', () => {
            const obstacles = [
                { x: 0, y: 2, width: 2, height: 2 }
            ]
            const actualModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon(playerPolygon),
                obstacles
            })
            expect(actualModel.obstacles.length).toEqual(1)
            expect(actualModel.obstacles[0]).toEqual(expect.objectContaining(obstacles[0]))
        })

        test('will set obstacleHit to true when player token collides', () => {
            const actualModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: -2, y: 1 }, { x: -2, y: 1 }, { x: 1, y: 1 }]),
                obstacles: [{ x: 0, y: 2, width: 2, height: 2 }]
            })
            expect(actualModel.obstacleHit).toEqual(true)
        })

        test('will not set obstacleHit to true if player token does not collide', () => {
            const actualModel = new LevelModel({
                endGoal: new Polygon(endPolygon),
                playerToken: new Polygon([{ x: -2, y: 5 }, { x: -2, y: 1 }, { x: 1, y: 1 }]),
                obstacles: [{ x: 5, y: 2, width: 2, height: 2 }]
            })
            expect(actualModel.obstacleHit).toEqual(false)
        })

    })

    describe('Stamps', () => {

        test('will setup a list of stamps', () => {
            const stamps = [
                { vertices: [{ x: 10, y: 10 }, { x: 10, y: 9 }, { x: 9, y: 10 }], collected: false },
                { vertices: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 8, y: 9 }], collected: false },
                { vertices: [{ x: 8, y: 8 }, { x: 8, y: 7 }, { x: 7, y: 8 }], collected: false }
            ]
            const model = new LevelModel({
                stamps,
                playerToken: new Polygon(playerPolygon),
            })
            stamps.forEach((stamp, i) => expect(model.stamps[i].vertices).polygonEquals(stamp.vertices))
        })

        test('will collect a stamp when matching with playertoken and set stamp to collected', () => {
            let p1 = [{ x: 3, y: 5 }, { x: 3, y: 8 }, { x: 0, y: 8 },]
            let p2 = [{ x: 3, y: 8 }, { x: 0, y: 8 }, { x: 3, y: 5 }]
            const model = new LevelModel({ stamps: [{ vertices: p1, collected: false }], playerToken: new Polygon(p2) })
            expect(model.stamps[0].collected).toEqual(true)
        })

        test('will collect a stamp with different vertex order', () => {
            const stamps = [
                { vertices: playerPolygon, collected: false },
                { vertices: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 8, y: 9 }], collected: false },
            ]
            const model = new LevelModel({ stamps, playerToken: new Polygon(playerPolygon) })
            expect(model.stamps[0].collected).toEqual(true)
            expect(model.stamps[1].collected).toEqual(false)
        })

        test('will get score based on number of stamp "points"', () => {
            const model = new LevelModel({
                stamps: [
                    { vertices: playerPolygon, collected: false, value: 3 },
                    { vertices: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 8, y: 9 }], collected: false, value: 7 },
                ],
                playerToken: new Polygon(playerPolygon),
            })
            expect(model.getStampScore()).toEqual(3)
        })

        test('will win level if acquiring 3 points on stamps', () => {
            const [model] = new LevelModel({
                stamps: [
                    { vertices: playerPolygon, collected: false, value: 3 },
                    { vertices: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 8, y: 9 }], collected: false, value: 7 },
                ],
                winCondition: model => model.getStampScore() >= 3,
                playerToken: new Polygon(playerPolygon),
            })
                .addBlock(Blocks.createCounterClockwise90DegreeRotation())
                .execute()

            expect(model.won).toBeTruthy()

        })

    })

})