import React from 'react'
import { render, fireEvent, waitForElement, getByText as domGetByText, getByTestId as domGetByTestId } from '@testing-library/react'
import LevelModel, { MEDALS, REWARDS } from '../model/levelModel'
import { verticesToSVGPoints, rectToSVGPoints, getStampColour } from '../components/gameComponents'
import { Circle, Polygon } from '../model/shapes'
import AxisRange from '../model/axisRange'
import _ from 'lodash'
import './assertions'
import errors from '../model/errors'
import App from "../App"
import { MemoryRouter } from 'react-router-dom'
import { setEndpoint } from '../model/dataCollectionApi'
import MockCollectionEndpoint from './mockDataCollectionEndpoint'
import { BLOCK_TYPES } from '../model/blocks'
import { goToLevel } from './fixtures'

const buttonNames = [
    'y-translate', 'x-translate',
    'cw-rotate', 'ccw-rotate',
    'x-reflect', 'y-reflect',
    'repeat',
    'go-button',
]

function assertButtonsDisabled(getByTestId) {
    buttonNames.forEach(buttonName => expect(getByTestId(buttonName)).toHaveAttribute('disabled'))
}

describe('Level Container', () => {

    let levelModel

    beforeEach(() => {
        setEndpoint(new MockCollectionEndpoint())
    })

    beforeEach(() => {
        levelModel = new LevelModel({
            endGoal: new Circle({ x: 1, y: 2 }),
            playerToken: new Circle({ x: 5, y: 6 }),
        })
    })

    test('Should render end goal', async () => {
        let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
        await goToLevel(getByTestId, 1)
        const endGoal = await waitForElement(() => getByTestId('end-goal'))
        expect(endGoal).toHaveAttribute('cx', '1')
        expect(endGoal).toHaveAttribute('cy', '2')
    })

    test('Block sequence counter should update correctly', async () => {
        let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
        await goToLevel(getByTestId, 1)
        fireEvent.click(await waitForElement(() => getByTestId('repeat')))
        fireEvent.click(await waitForElement(() => getByTestId('x-translate')))
        fireEvent.click(await waitForElement(() => getByTestId('x-translate')))
        let counter = await waitForElement(() => getByTestId('block-counter'))
        expect(counter).toHaveTextContent('3')
    })

    describe('Execute', () => {

        test('execute, shape goes out of bounds', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let upButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))

            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)

            fireEvent.click(goButton)

            await waitForElement(() => {
                const player = getByTestId('player-token')
                expect(player).toHaveAttribute('cx', '5')
                expect(player).toHaveAttribute('cy', '10')
                expect(getByText('Your triangle has gone out of bounds.'))
                return player
            })
        })

        test('Should complete level, disable buttons, and show win message', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let translateButton = await waitForElement(() => getByTestId('y-translate'))
            fireEvent.click(translateButton)

            fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '-4' } })

            let translateButton2 = await waitForElement(() => getByTestId('x-translate'))
            fireEvent.click(translateButton2)

            fireEvent.change(getByTestId('step-input-1-0'), { target: { value: '-4' } })

            fireEvent.click(getByTestId('go-button'))
            await waitForElement(() => getByTestId('win-msg'))

            assertButtonsDisabled(getByTestId)
        })

        test('renders number of moves at end of level', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let downButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))

            // const text = 'Number of Moves: '
            await waitForElement(() => {
                const numOfMoves = getByTestId('number-of-moves')
                expect(numOfMoves).toHaveTextContent('0')
                return numOfMoves
            })

            fireEvent.click(downButton)
            fireEvent.click(downButton)
            fireEvent.click(downButton)
            fireEvent.click(goButton)

            await waitForElement(() => {
                const numOfMoves = getByTestId('number-of-moves')
                expect(numOfMoves).toHaveTextContent('1')
                return numOfMoves
            })

            await waitForElement(() => {
                const numOfMoves = getByTestId('number-of-moves')
                expect(numOfMoves).toHaveTextContent('2')
                return numOfMoves
            })

            await waitForElement(() => {
                const numOfMoves = getByTestId('number-of-moves')
                expect(numOfMoves).toHaveTextContent('3')
                return numOfMoves
            })

        })

        test('buttons will be disabled during execute', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let upButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(goButton)

            await waitForElement(() => {
                const player = getByTestId('player-token')
                expect(player).toHaveAttribute('cy', '7')
                return player
            })

            assertButtonsDisabled(getByTestId)

        })

        test('should only show win message after complete', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let downButton = await waitForElement(() => getByTestId('y-translate'))
            let leftButton = await waitForElement(() => getByTestId('x-translate'))



            let goButton = await waitForElement(() => getByTestId('go-button'))
            fireEvent.click(leftButton)
            fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '-4' } })

            fireEvent.click(downButton)
            fireEvent.change(getByTestId('step-input-1-0'), { target: { value: '-4' } })
            fireEvent.click(downButton)
            fireEvent.change(getByTestId('step-input-2-0'), { target: { value: '-1' } })
            fireEvent.click(goButton)

            await waitForElement(() => {
                const player = getByTestId('player-token')
                expect(player).toHaveAttribute('cx', '1')
                expect(player).toHaveAttribute('cy', '2')
                return player
            })

            expect(() => getByTestId('win-msg')).toThrow()
        })

        test('Will show 3 intermediate states during execute', async () => {

            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let upButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(upButton)
            fireEvent.click(goButton)

            await waitForElement(() => {
                const player = getByTestId('player-token')
                expect(player).toHaveAttribute('cy', '7')
                return player
            })

            await waitForElement(() => {
                const player = getByTestId('player-token')
                expect(player).toHaveAttribute('cy', '8')
                return player
            })
            await waitForElement(() => {
                const player = getByTestId('player-token')
                expect(player).toHaveAttribute('cy', '9')
                return player
            })

        })

        test('Execute button is disabled if loop repetitions is less than 2' , async () => {
            let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)

            let goButton = await waitForElement(() => getByTestId('go-button'))
            let loopButton = await waitForElement(() => getByTestId('repeat'))

            fireEvent.click(loopButton)

            fireEvent.change(getByTestId('step-input-root-0'), { target: { value: '1' } })
            
            expect(goButton).toHaveAttribute('disabled')

        })
    })

    describe('Coding Blocks', () => {

        test('Will only render the available blocks to pick from', async () => {
            const availableBlocks = [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate]
            const newModel = new LevelModel({ ...levelModel, availableBlocks })
            let { getByText, getByTestId } = render(<App levels={[newModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            await waitForElement(() => getByTestId('x-translate'))
            await waitForElement(() => getByTestId('y-translate'))
            expect(() => getByTestId('cw-rotate')).toThrow()
            expect(() => getByTestId('ccw-rotate')).toThrow()
            expect(() => getByTestId('cw-rotate-arg')).toThrow()
            expect(() => getByTestId('ccw-rotate-arg')).toThrow()
            expect(() => getByTestId('x-reflect')).toThrow()
        })

        test('Remove loop then add instruction should work', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let loopButton = await waitForElement(() => getByTestId('repeat'))
            fireEvent.click(loopButton)
            let loopRemove = await waitForElement(() => getByTestId('remove-0'))
            fireEvent.click(loopRemove)
            let translateButton = await waitForElement(() => getByTestId('x-translate'))
            fireEvent.click(translateButton)
            expect(getByTestId('step-input-0-0'))
        })

        test('cannot execute an empty queue', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let goButton = await waitForElement(() => getByTestId('go-button'))
            expect(getByTestId('go-button')).toHaveAttribute('disabled')
        })

        test('Should render instructions', async () => {
            let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            await waitForElement(() => buttonNames.every(buttonName => getByTestId(buttonName)))
        })

        test('Should render an empty queue', async () => {
            let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            await waitForElement(() => getByTestId('queue-box'))
            await waitForElement(() => getByTestId('go-button'))
        })

        test('When clicking on instruction, queue MUST be updated', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let translateButton = await waitForElement(() => getByTestId('y-translate'))
            fireEvent.click(translateButton)

            expect(getByTestId('step-input-0-0').value).toEqual("1")
        })

        test('When clicking on X, element in queue MUST be deleted', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let translateButton = await waitForElement(() => getByTestId('y-translate'))
            let rotateButton = await waitForElement(() => getByTestId('ccw-rotate'))
            fireEvent.click(translateButton)
            fireEvent.click(rotateButton)

            let translateRemove = await waitForElement(() => getByTestId('remove-0'))
            fireEvent.click(translateRemove)

            expect(() => getByTestId('step-input-1-0')).toThrow()
        })

        test('Clicking execute, executes instructions on queue', async () => {
            let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let translateButton = await waitForElement(() => getByTestId('y-translate'))
            let translateButton2 = await waitForElement(() => getByTestId('x-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))

            fireEvent.click(translateButton)
            fireEvent.click(translateButton2)
            fireEvent.click(goButton)

            await waitForElement(() => {
                const player = getByTestId('player-token')
                expect(player).toHaveAttribute('cx', '6')
                expect(player).toHaveAttribute('cy', '7')
                return player
            })

        })

        describe('Loops', () => {

            test('Add empty to loop', async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let startLoopButton = await waitForElement(() => getByTestId('repeat'))

                fireEvent.click(startLoopButton)
                expect(getByText('Repeat'))
            })

            test('Adds transform to loop', async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let startLoopButton = await waitForElement(() => getByTestId('repeat'))
                let translateButton = await waitForElement(() => getByTestId('y-translate'))

                fireEvent.click(startLoopButton)
                fireEvent.click(translateButton)

                let loopContainer = getByText('Repeat')
                expect(domGetByTestId(loopContainer.parentElement.parentElement, 'step-input-root-0'))
            })

            test('Executing an empty loop should do nothing', async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let startLoopButton = await waitForElement(() => getByTestId('repeat'))
                let goButton = await waitForElement(() => getByTestId('go-button'))

                fireEvent.click(startLoopButton)
                fireEvent.click(goButton)

                await waitForElement(() => {
                    const player = getByTestId('player-token')
                    expect(player).toHaveAttribute('cx', '5')
                    expect(player).toHaveAttribute('cy', '6')
                    return player
                })
            })

            test('When inside a loop, the Loop coding block should be disabled', async () => {
                let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let startLoopButton = await waitForElement(() => getByTestId('repeat'))
                fireEvent.click(startLoopButton)

                let startLoopButtonAfterClick = await waitForElement(() => getByTestId('repeat'))
                expect(startLoopButtonAfterClick).toHaveAttribute('disabled')
            })

        })

        describe('Parameters', () => {

            test('Can translate 3 units to the left by using the input text box', async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let commandHorizontalBlock = getByTestId('x-translate')
                fireEvent.click(commandHorizontalBlock)

                let horizontalTextBox = getByTestId('step-input-0-0')
                fireEvent.change(horizontalTextBox, { target: { value: '-3' } })

                let goButton = getByTestId('go-button')
                fireEvent.click(goButton)

                await waitForElement(() => {
                    const afterClickPlayerCircle = getByTestId('player-token')
                    expect(afterClickPlayerCircle).toHaveAttribute('cx', '2')
                    expect(afterClickPlayerCircle).toHaveAttribute('cy', '6')
                    return afterClickPlayerCircle
                })
            })

            test('Can translate 3 units up by using the input text box', async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let commandVerticalBlock = getByTestId('y-translate')
                fireEvent.click(commandVerticalBlock)

                let verticalTextBox = getByTestId('step-input-0-0')
                fireEvent.change(verticalTextBox, { target: { value: '3' } })

                let goButton = getByTestId('go-button')
                fireEvent.click(goButton)

                await waitForElement(() => {
                    const afterClickPlayerCircle = getByTestId('player-token')
                    expect(afterClickPlayerCircle).toHaveAttribute('cx', '5')
                    expect(afterClickPlayerCircle).toHaveAttribute('cy', '9')
                    return afterClickPlayerCircle
                })
            })

            test('can change rotation point', async () => {
                let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let cw_args = await waitForElement(() => getByTestId('cw-rotate-arg'))
                fireEvent.click(cw_args)
                fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '5' } })
                fireEvent.change(getByTestId('step-input-0-1'), { target: { value: '5' } })
                let goButton = await waitForElement(() => getByTestId('go-button'))
                fireEvent.click(goButton)

                await waitForElement(() => {
                    const player = getByTestId('player-token')
                    expect(player).toHaveAttribute('cx', '6')
                    return player
                })
            })

            test('can change X reflection point', async () => {
                let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let reflect = await waitForElement(() => getByTestId('x-reflect-arg'))
                fireEvent.click(reflect)
                fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '4' } })
                let goButton = await waitForElement(() => getByTestId('go-button'))
                fireEvent.click(goButton)

                await waitForElement(() => {
                    const player = getByTestId('player-token')
                    expect(player).toHaveAttribute('cy', '2')
                    return player
                })
            })

            test('can change Y reflection point', async () => {
                let { getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let reflect = await waitForElement(() => getByTestId('y-reflect-arg'))
                fireEvent.click(reflect)
                fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '6' } })
                let goButton = await waitForElement(() => getByTestId('go-button'))
                fireEvent.click(goButton)

                await waitForElement(() => {
                    const player = getByTestId('player-token')
                    expect(player).toHaveAttribute('cx', '7')
                    return player
                })
            })

            test('Change change loop count', async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let startLoopButton = await waitForElement(() => getByTestId('repeat'))
                let translateButton = await waitForElement(() => getByTestId('y-translate'))
                fireEvent.click(startLoopButton)
                fireEvent.click(translateButton)
                fireEvent.change(getByTestId('step-input-root-0'), { target: { value: '4' } })
                let goButton = await waitForElement(() => getByTestId('go-button'))
                fireEvent.click(goButton)
                await waitForElement(() => {
                    const player = getByTestId('player-token')
                    expect(player).toHaveAttribute('cy', '10')
                    return player
                })
            })

            test("Negative loop iterations should not be executed", async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let startLoopButton = await waitForElement(() => getByTestId('repeat'))
                let goButton = await waitForElement(() => getByTestId('go-button'))

                fireEvent.click(startLoopButton)

                fireEvent.change(getByTestId('step-input-root-0'), { target: { value: '-3' } })

                fireEvent.click(goButton)

                await waitForElement(() => {
                    const player = getByTestId('player-token')
                    expect(player).toHaveAttribute('cx', '5')
                    expect(player).toHaveAttribute('cy', '6')
                    return player
                })

            })

            test('Loop iteration amount of zero should do nothing', async () => {
                let { getByText, getByTestId } = render(<App levels={[levelModel]} RouterComponent={MemoryRouter} />)
                await goToLevel(getByTestId, 1)
                let startLoopButton = await waitForElement(() => getByTestId('repeat'))
                let goButton = await waitForElement(() => getByTestId('go-button'))

                fireEvent.click(startLoopButton)

                fireEvent.change(getByTestId('step-input-root-0'), { target: { value: '0' } })

                fireEvent.click(goButton)

                await waitForElement(() => {
                    const player = getByTestId('player-token')
                    expect(player).toHaveAttribute('cx', '5')
                    expect(player).toHaveAttribute('cy', '6')
                    return player
                })
            })
        })

    })

    describe('Rewards', () => {

        const rewardModel = new LevelModel({
            endGoal: new Circle({ x: 1, y: 2 }),
            playerToken: new Circle({ x: 5, y: 6 }),
            rewards: [{ type: REWARDS.blue, x: 0, y: 5 }],
        })

        test('will render a reward', async () => {
            let { getByText, getByTestId } = render(<App levels={[rewardModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            const reward = await waitForElement(() => getByTestId('reward-0'))
            expect(reward).toHaveAttribute('cx', '0')
            expect(reward).toHaveAttribute('cy', '5')
        })

        test('will render a list of rewards', async () => {
            const lm = new LevelModel({ ...rewardModel, rewards: [{ type: REWARDS.blue, x: 0, y: 5 }, { type: REWARDS.blue, x: 0, y: 8 }, { type: REWARDS.blue, x: 5, y: -5 }] })
            let { getByText, getByTestId } = render(<App levels={[lm]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            _.range(3).forEach(i => {
                let r = getByTestId('reward-' + i)
                expect(r).toHaveAttribute('cx', '' + lm.rewards[i].x)
                expect(r).toHaveAttribute('cy', '' + lm.rewards[i].y)
            })
        })

        test('will display a score', async () => {
            let { getByText, getByTestId } = render(<App levels={[rewardModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            expect(getByTestId('yellow-collected')).toHaveTextContent('0')
            expect(getByTestId('blue-collected')).toHaveTextContent('0')
        })

        test('will collect and remove a reward, increase score', async () => {
            const lm = new LevelModel({ ...rewardModel, playerToken: new Circle({ x: 0, y: 7 }) })

            let { getByText, getByTestId } = render(<App levels={[lm]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let downButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))
            fireEvent.click(downButton)

            fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '-2' } })

            fireEvent.click(goButton)

            await waitForElement(() => {
                const score = getByTestId('blue-collected')
                expect(score).toHaveTextContent('1')
                return score
            })

            expect(() => getByTestId('reward-0')).toThrow()
        })

        test('will collect and move past a reward, increase score', async () => {
            const lm = new LevelModel({
                ...rewardModel,
                playerToken: new Circle({ x: 0, y: 6 }),
                rewards: [{ type: REWARDS.yellow, x: 0, y: 5 }],
            })
            let { getByText, getByTestId } = render(<App levels={[lm]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let downButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))
            fireEvent.click(downButton)
            fireEvent.click(downButton)
            fireEvent.click(downButton)

            fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '-1' } })
            fireEvent.change(getByTestId('step-input-1-0'), { target: { value: '-1' } })
            fireEvent.change(getByTestId('step-input-2-0'), { target: { value: '-1' } })

            fireEvent.click(goButton)

            await waitForElement(() => {
                const gems = getByTestId('yellow-collected')
                expect(gems).toHaveTextContent('1')
                return gems
            })

            expect(() => getByTestId('reward-0')).toThrow()
        })



    })

    describe('Medals', () => {

        let medalModel
        let medalCriteria = [
            { medal: MEDALS.bronze, attained: (levelModel => levelModel.collectedRewards.length >= 1), description: 'Collect 1 reward' },
            { medal: MEDALS.silver, attained: (levelModel => levelModel.collectedRewards.length >= 2), description: 'Collect 2 rewards' },
            { medal: MEDALS.gold, attained: (levelModel => levelModel.collectedRewards.length >= 3), description: 'Collect 3 rewards' }
        ]
        beforeEach(() => {
            medalModel = new LevelModel({
                endGoal: new Circle({ x: 0, y: 1 }),
                playerToken: new Circle({ x: 1, y: 0 }),
                rewards: [new Circle({ x: 1, y: 1 })],
                medalCriteria
            })
        })


        test('Will render level criteria', async () => {
            let { getByText, getByTestId } = render(<App levels={[medalModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let scoringDiv = await waitForElement(() => getByTestId('scoring'))
            expect(scoringDiv).toHaveTextContent((medalCriteria[0].description))
            expect(scoringDiv).toHaveTextContent((medalCriteria[1].description))
            expect(scoringDiv).toHaveTextContent(medalCriteria[2].description)
        })

        test('Will receive designated medal after collecting points', async () => {
            let { getByText, getByTestId } = render(<App levels={[medalModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let upButton = await waitForElement(() => getByTestId('y-translate'))
            let leftButton = await waitForElement(() => getByTestId('x-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))

            fireEvent.click(upButton)
            fireEvent.click(leftButton)
            fireEvent.change(getByTestId('step-input-1-0'), { target: { value: '-1' } })
            fireEvent.click(goButton)

            await waitForElement(() => {
                const medal = getByTestId('bronze-token')
                return medal
            })
        })

        test('Will not render medal if none was acquired at end of game', async () => {
            let { getByText, getByTestId } = render(<App levels={[medalModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let upButton = await waitForElement(() => getByTestId('y-translate'))
            let leftButton = await waitForElement(() => getByTestId('x-translate'))
            fireEvent.click(leftButton)
            fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '-1' } })
            fireEvent.click(upButton)
            fireEvent.click(getByTestId('go-button'))

            await waitForElement(() => {
                return getByTestId('not-won-modal')
            })
            expect(() => getByTestId('bronze-token')).toThrow()

        })

        test('Will not show medal of level complete if last move took you out of bounds but was placed on the end goal', async () => {

            const model = new LevelModel({
                endGoal: new Circle({ x: 2, y: 0 }),
                playerToken: new Circle({ x: 0, y: 0 }),
                rewards: [new Circle({ x: 1, y: 0 })],
                medalCriteria: [{ medal: MEDALS.bronze, attained: ({ score }) => score >= 1 }],
                axisRange: new AxisRange({ minX: -2, maxX: 2, minY: -2, maxY: 2 })
            })

            let { getByText, getByTestId } = render(<App levels={[model]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let rightButton = await waitForElement(() => getByTestId('x-translate'))
            fireEvent.click(rightButton); fireEvent.click(rightButton); fireEvent.click(rightButton)
            fireEvent.click(getByTestId('go-button'))

            await waitForElement(() => getByTestId('level-error'))
            expect(() => getByTestId('bronze-token')).toThrow()
            expect(() => getByTestId('won-modal')).toThrow()
        })

        test('Will render all acquired medals', async () => {
            const model = new LevelModel({
                endGoal: new Circle({ x: 2, y: 0 }),
                playerToken: new Circle({ x: 0, y: 0 }),
                rewards: [new Circle({ x: 1, y: 0 })],
                medalCriteria: [{ medal: MEDALS.bronze, attained: ({ score }) => score >= 1 }],
                acquiredMedals: [MEDALS.bronze, MEDALS.silver],
                axisRange: new AxisRange({ minX: -2, maxX: 2, minY: -2, maxY: 2 })
            })

            let { getByText, getByTestId } = render(<App levels={[model]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            expect(getByTestId('bronze-token'))
            expect(getByTestId('silver-token'))
        })
    })

    describe('Obstacles', () => {

        let playerPolygon = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }]
        const obstacle = { x: 0, y: 3, width: 2, height: 2 }

        test('obstacles are rendered', async () => {
            const actualModel = new LevelModel({
                playerToken: new Polygon(playerPolygon),
                obstacles: [obstacle]
            })
            let { getByText, getByTestId } = render(<App levels={[actualModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            await waitForElement(() => {
                const obstacleSVG = getByTestId('obstacle-0')
                return obstacleSVG
            })
        })

        test('if obstacle is hit, game over, display modal', async () => {
            const actualModel = new LevelModel({
                playerToken: new Polygon(playerPolygon),
                obstacles: [obstacle]
            })
            let { getByText, getByTestId } = render(<App levels={[actualModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let translateButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))
            fireEvent.click(translateButton)
            fireEvent.click(goButton)

            await waitForElement(() => {
                return getByTestId('obstacle-hit-modal') && getByText(errors.hitObstacle)
            })
        })

        test('if obstacle is hit, game over, user can press start over and polygons are set back to original positions and execution queue is maintained', async () => {

            const actualModel = new LevelModel({
                playerToken: new Polygon(playerPolygon),
                obstacles: [obstacle]
            })
            let { getByText, getByTestId } = render(<App levels={[actualModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            let translateButton = await waitForElement(() => getByTestId('y-translate'))
            let goButton = await waitForElement(() => getByTestId('go-button'))
            fireEvent.click(translateButton)
            fireEvent.click(goButton)

            // start over button
            let startOver = await waitForElement(() => getByTestId('start-over'))
            fireEvent.click(startOver)

            // polgon is start position
            await waitForElement(() => {
                const obstacleSVG = getByTestId('player-token')
                expect(obstacleSVG).toHaveAttribute('points', verticesToSVGPoints(playerPolygon))
                return obstacleSVG
            })

            // queue length is the same
            await waitForElement(() => getByTestId('step-input-0-0'))

        })

    })

    describe('Stamps', () => {

        const playerVerts = [{ x: 10, y: 10 }, { x: 10, y: 9 }, { x: 9, y: 10 }]
        const stamps = [
            { vertices: playerVerts, collected: false, value: 1 },
            { vertices: [{ x: 9, y: 9 }, { x: 9, y: 8 }, { x: 8, y: 9 }], collected: false, value: 1 },
            { vertices: [{ x: 8, y: 8 }, { x: 8, y: 7 }, { x: 7, y: 8 }], collected: false, value: 2 }
        ]
        let stampModel = new LevelModel({
            stamps,
            playerToken: new Polygon(playerVerts),
        })

        test('renders stamps', async () => {
            let { getByText, getByTestId } = render(<App levels={[stampModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            await waitForElement(() => {
                expect(getByTestId('stamp-0')).toHaveAttribute('points', verticesToSVGPoints(stamps[0].vertices))
                expect(getByTestId('stamp-1')).toHaveAttribute('points', verticesToSVGPoints(stamps[1].vertices))
                expect(getByTestId('stamp-2')).toHaveAttribute('points', verticesToSVGPoints(stamps[2].vertices))
                return true
            })
        })

        test('renders collected stamps as different colour', async () => {
            let { getByText, getByTestId } = render(<App levels={[stampModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            expect(getByTestId('stamp-1')).toHaveStyle('fill: ' + getStampColour({ ...stamps[1] }))
            expect(getByTestId('stamp-2')).toHaveStyle('fill: ' + getStampColour({ ...stamps[2] }))
        })

        test('renders stamps of different point values as different colours', async () => {
            let { getByText, getByTestId } = render(<App levels={[stampModel]} RouterComponent={MemoryRouter} />)
            await goToLevel(getByTestId, 1)
            expect(getByTestId('stamp-0')).toHaveStyle('fill: ' + getStampColour({ ...stamps[0], collected: true }))
            expect(getByTestId('stamp-1')).toHaveStyle('fill: ' + getStampColour({ ...stamps[1] }))
        })

    })

})
