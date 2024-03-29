import React, { useState, useEffect } from 'react'
import LevelModel, { MEDALS, REWARDS } from '../model/levelModel'
import Counter from '../assets/counter.svg'
import BronzeShield from '../assets/bronzeShield.svg'
import SilverShield from '../assets/silverShield.svg'
import GoldShield from '../assets/goldShield.svg'
import NoShield from '../assets/noShield.svg'
import Coin from '../assets/coin.svg'
import StampIcon from '../assets/stampCounter.svg'
import CodingBlocks from './codingBlocks'
import BlockSequence from './blockSequence'
import { BlockQueue, LoopBlock, BLOCK_TYPES, getSequenceData } from '../model/blocks'
import { PlayingField, Reward, Obstacle, PlayerToken, EndGoal, Stamp, GridLines, AxisLines, GamePieceView, gemMap } from './gameComponents'
import errors from '../model/errors'
import { logLevelInDataCollection, logLevelRunInDataCollection } from '../model/dataCollectionApi'
import { useHistory } from "react-router-dom"
import SideParchment from "../assets/side-parchment.svg"
import Parchment from "../assets/Parchment.svg"
import FeedbackParchment from "../assets/feedbackParchment.svg"
import CodingBlocksBackground from "../assets/CodingBlockBackground.svg"
import { MissionButton, MissionModal, RestartButton, PlayAgainButton, AdvanceLevelButton } from './uiComponents'
import { storyMap } from '../levelData'
import { Frame } from "framer"
import BackToMap from "../assets/backtoMap.svg"
import { TIMERS, logEvent, logTime, secsSinceLast, updateState } from '../model/reactLogger'

const shieldMap = {
    [MEDALS.bronze]: BronzeShield,
    [MEDALS.silver]: SilverShield,
    [MEDALS.gold]: GoldShield,
    [MEDALS.noMedal]: NoShield
}

// TODO Work on decreasing this test wait ms. Any lower and we get Act errors
const executionStepDelay = process.env.NODE_ENV === 'test' ? 28 : 500

const Feedback = ({ children, className, style, ...rest }) => {
    return <div className='z-10 flex items-start fixed inset-0 bg-modal'>
        <Frame initial={{ y: -625 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 12, mass: 0.6 }} background='transparent'>
            <div
                className={'flex flex-col justify-between items-center p-12 ' + className}
                style={{
                    backgroundImage: `url(${FeedbackParchment})`, height: '683px', width: '362px',
                    paddingTop: '320px', transform: 'translate(145px, -60px)', ...style
                }} {...rest}
            >
                {children}
            </div>
        </Frame>
    </div >
}

const scoringStamp = [{ x: 3, y: 0 }, { x: 0, y: -2 }, { x: 3, y: -2 }]

const SideMenu = ({ title, yPos = 0, isOpen, onTap, children, style, className, ...rest }) => {
    const xOff = isOpen ? -425 : 0
    return (
        <Frame
            className={'fixed z-20 -mr-4'} transition={{ type: "spring", damping: 8, mass: 0.25 }} background=''
            style={{ top: yPos, right: 0, width: '160px', height: '48px' }} animate={{ x: xOff }}
        >
            <div
                className={'flex items-center pt-2 cursor-pointer pl-4'} onClick={onTap}
                style={{
                    backgroundImage: `url(${SideParchment})`, height: '100%', fontFamily: "Luckiest Guy, cursive",
                    color: '#576b91', fontSize: '18px'
                }}
            >
                {title}
            </div>

            <div
                className={'flex flex-col p-12'} {...rest}
                style={{
                    backgroundImage: `url(${Parchment})`, height: '582px', width: '468px',
                    transform: 'translate(145px, -60px)'
                }}
            >
                {children}
            </div>
        </Frame>
    )
}

const Medal = ({ medal, style, ...rest }) => <img style={{ width: '63px', height: '87px', ...style }} alt={'Shield'} src={medal} {...rest}/>

const LevelContainer = ({ afterExecute, ...props }) => {

    let history = useHistory()
    const [levelModel, setLevelModel] = useState(props.levelModel)
    const [missionModal, setMissionModal] = useState(props.levelModel.acquiredMedals.length === 0)
    const [executionView, setExecutionView] = useState([])
    const [openSideMenuIndex, setOpenSideMenuIndex] = useState(null)
    const toggleSideMenuAt = i => setOpenSideMenuIndex(openSideMenuIndex === i ? null : i)
    const isExecuting = levelModel.executionStep !== undefined
    const storyText = storyMap[levelModel.number]
    useEffect(() => logLevelInDataCollection(levelModel))
    useEffect(() => {
        const executionTimerId = setTimeout(() => nextModelView(executionView), executionStepDelay)
        return () => clearTimeout(executionTimerId)
        // TODO This is complaining about nextModelView function being called in here, an im not sure why
        // eslint-disable-next-line
    }, [executionView])

    const nextModelView = models => {
        if (models.length) {
            if (models.length === 1 && afterExecute) afterExecute(models[0])
            const newModel = models[0]
            setLevelModel(newModel)
            logEvent("sequence_execution_step", {
                'type': newModel.stepType, 
                'moves_count': newModel.numberOfMoves, 
                'blue_gems': newModel.numberOfGemsCollected(REWARDS.blue), 
                'yellow_gems': newModel.numberOfGemsCollected(REWARDS.yellow), 
                'stamp_points': newModel.getStampScore(), 
                'outcome': newModel.judgeOutcome()});
            setExecutionView(models.filter((_, i) => i > 0))
        }
    }

    const executeInstructions = () => {
        logEvent("run_sequence", {'sequence_elements': getSequenceData(levelModel.blockQueue.queue)})
        let stepModels = levelModel.execute()
        const lastModel = stepModels[stepModels.length - 1]
        logLevelRunInDataCollection(stepModels[0], lastModel)
        nextModelView(stepModels)
    }

    const setEditLoop = loop => setLevelModel(levelModel.setEditLoop(loop))
    const addBlock = block => setLevelModel(levelModel.addBlock(block))
    const reorderInstructions = newBlocks => setLevelModel(new LevelModel({ ...levelModel, blockQueue: new BlockQueue(newBlocks) }))
    const updateInstruction = (oldBlock, newBlock) => setLevelModel(replaceInstruction(oldBlock, newBlock))
    const restart = () => setLevelModel(new LevelModel({ ...props.levelModel, blockQueue: levelModel.blockQueue, editLoops: levelModel.editLoops }))
    const goToSelectionPage = () => history.push('/selection')
    const replaceInstruction = (oldBlock, newBlock) => {
        let editLoop = levelModel.editLoop
        let changeEditLoopsIfNeeded = (oldLoop, newLoop) => { if (editLoop === oldLoop) editLoop = newLoop }

        let replaceBlock = (block) => {
            if (block === oldBlock) {
                changeEditLoopsIfNeeded(block, newBlock)
                return newBlock
            }
            if (block.type === BLOCK_TYPES.repeat) {
                const newQueue = block.blockQueue.queue.map(replaceBlock)
                let newLoop = new LoopBlock({ ...block, blockQueue: new BlockQueue(newQueue) })
                changeEditLoopsIfNeeded(block, newLoop)
                block = newLoop
            }
            return block
        }
        let newQueue = new BlockQueue(levelModel.blockQueue.queue.map(replaceBlock))
        logEvent("sequence_updated",{'sequence_elements': getSequenceData(newQueue.queue)})
        return new LevelModel({ ...levelModel, blockQueue: newQueue, editLoop })
    }

    const removeInstruction= rBlock => {
        let filterBlock = block => block !== rBlock

        let blocks = levelModel.blockQueue.queue
        let blockIndex = blocks.indexOf(rBlock)

        const checkForLoopsContainingBlock = (blocks) => {
            for (let loopBlock of blocks.filter(block => block.type === BLOCK_TYPES.repeat)) {
                const loopChildren = loopBlock.blockQueue.queue
                 // if in a loop, replace the loop with a new one populated with all others
                let checkIndex = loopChildren.indexOf(rBlock)
                 if (checkIndex !== -1) {
                    blockIndex = checkIndex;
                    return replaceInstruction(loopBlock, loopBlock.removeBlock(rBlock))
                }
                const maybeNewModel = checkForLoopsContainingBlock(loopChildren)
                if (maybeNewModel) return maybeNewModel
            }
        }

        let editLoop = filterBlock(levelModel.editLoop) ? levelModel.editLoop : undefined
        let inLoop = false;
        let newModel;
        if (blockIndex !== -1) {
            blocks = new BlockQueue(levelModel.blockQueue.queue.filter(filterBlock))
            newModel = new LevelModel({ ...levelModel, blockQueue: blocks, editLoop })
            setLevelModel(newModel)
            blocks = blocks.queue
        }
        else {
            newModel = checkForLoopsContainingBlock(blocks)
            inLoop = true;
            setLevelModel(new LevelModel({ ...newModel}))
        }
        updateState({level: newModel.number, level_shields: [...newModel.acquiredMedals] ,sequence_block_count: newModel.numberOfBlocksUsed})
        logEvent("delete_block", {"block_index": blockIndex, "in_loop": inLoop, "block_type": rBlock.type, "block_params": rBlock.paramMap})
        logEvent("sequence_updated", {'sequence_elements': getSequenceData(blocks)})
    }

    // const onClickPlay = () => {

    // }
    
    const onClickMissionButton = () => {
        if (missionModal) {
            logEvent("click_dismiss_mission", {time_open: secsSinceLast(TIMERS.MISSION)})
        } else {
            logEvent("click_level_mission")
            logTime(TIMERS.MISSION)
        }
        setMissionModal(!missionModal)
    }

    const onClickReplayButton = () => {
        // console.log("Replay level");
        logEvent("click_replay_level");
        logEvent("dismiss_sequence_feedback", {time_open: secsSinceLast(TIMERS.FEEDBACK)})
        restart();
    }

    const onClickNextLevelButton = () => {
        // console.log("Next level");
        logEvent("click_next_level")
        logEvent("dismiss_sequence_feedback", {time_open: secsSinceLast(TIMERS.FEEDBACK)})
        goToSelectionPage()
    }

    const onClickReturnButton = () => {
        // console.log("Return to Map")
        logEvent("click_return_to_map")
        if (!levelModel.won) {
            logEvent("level_quit")
        }
        goToSelectionPage();
    }

    const toggleLegend = () => {
        if (openSideMenuIndex === 0) {
            logEvent("dismiss_legend", {time_open: secsSinceLast(TIMERS.LEGEND)})
        } else {
            logEvent("legend_displayed")
            logTime(TIMERS.LEGEND)
        }
        toggleSideMenuAt(0)
    }

    const toggleObjective = () => {
        if (openSideMenuIndex === 1) {
            logEvent("dismiss_objective", {time_open: secsSinceLast(TIMERS.OBJECTIVES)})
        } else {
            logEvent("objectives_displayed", {
                bronze_objective_text: levelModel.medalCriteria[0].description,
                silver_objective_text: levelModel.medalCriteria[1].description,
                gold_objective_text: levelModel.medalCriteria[2].description
            })
            logTime(TIMERS.OBJECTIVES)
        }
        toggleSideMenuAt(1)
    }


    const completedContent = (() => {
        if (!levelModel.complete) return null

        const rewards = {
            blue_gems: levelModel.numberOfGemsCollected(REWARDS.blue),
            yellow_gems: levelModel.numberOfGemsCollected(REWARDS.yellow),
            stamp_points: levelModel.getStampScore()
        }

        if (levelModel.error) {
            const failTitle = "Out of Bounds!";
            const failText = levelModel.error.message;
            if (!levelModel.loggedComplete) {
                logEvent("sequence_fail_displayed", {outcome: "OUT_OF_BOUNDS", outcome_title: failTitle, outcome_text: failText,  moves_count: levelModel.numberOfMoves, level_shields: levelModel.acquiredMedals, collected_items: rewards})
                logTime(TIMERS.FEEDBACK);
                levelModel.loggedComplete = true;
            }
            return <>
                <div data-testid='level-error' className='text-carnation text-3xl' style={{ fontFamily: 'Luckiest Guy' }}>{failTitle}</div>
                <div className="mt-5 text-lg text-mineShaft mb-16 text-center">{failText}</div>
                <RestartButton onClick={() => {
                    logEvent("dismiss_sequence_feedback", {time_open: secsSinceLast(TIMERS.FEEDBACK)})
                    restart();
                    }} />
            </>
        }


        if (levelModel.obstacleHit) {
            if (!levelModel.loggedComplete) {
                logEvent("sequence_fail_displayed", {outcome: 'COLLISION', outcome_title: 'Collision!', outcome_text: errors.hitObstacle, moves_count: levelModel.numberOfMoves, level_shields: levelModel.acquiredMedals})
                logTime(TIMERS.FEEDBACK)  
                levelModel.loggedComplete = true;
            }
            return <>
                <div data-testid='obstacle-hit-modal' className='text-carnation text-3xl' style={{ fontFamily: 'Luckiest Guy' }}>Collision!</div>
                <div className="mt-5 text-lg text-mineShaft mb-16">{errors.hitObstacle}</div>
                <RestartButton onClick={() => {
                    logEvent("dismiss_sequence_feedback", {time_open: secsSinceLast(TIMERS.FEEDBACK)})
                    restart();
                    }} />
            </>
        }


        if (levelModel.won && levelModel.medal) {
            const wonTitle = "Shield achieved:"
            const wonDetail = "Advance to the next level, or play this level again for a higher score."
            const rewards = {
                blue_gems: levelModel.numberOfGemsCollected(REWARDS.blue),
                yellow_gems: levelModel.numberOfGemsCollected(REWARDS.yellow),
                stamp_points: levelModel.getStampScore()
            }
            if (!levelModel.loggedComplete) {
                updateState({level_shields: [...levelModel.acquiredMedals]})
                logEvent("sequence_success_displayed", {outcome: levelModel.medal, outcome_title: wonTitle, outcome_text: wonDetail, moves_count: levelModel.numberOfMoves, level_shields: levelModel.acquiredMedals, collected_items: rewards})
                logTime(TIMERS.FEEDBACK);
                logEvent("level_complete");
                levelModel.loggedComplete = true;
            }
            return <>
                <div data-testid='won-modal' className='text-cerulean text-3xl' style={{ fontFamily: 'Luckiest Guy' }}>{wonTitle}</div>
                <Medal medal={shieldMap[levelModel.medal]} />
                <div className="text-lg text-mineShaft">{wonDetail}</div>
                <AdvanceLevelButton onClick={onClickNextLevelButton} />
                <PlayAgainButton onClick={onClickReplayButton} />
            </>
        }

        const failTitle = "Keep trying!";
        const failText = "You must achieve a Bronze medal in order to advance to the next level."
        if (!levelModel.loggedComplete) {
            logEvent("sequence_fail_displayed", {outcome: "FAILED_OBJECTIVE", outcome_title: failTitle, outcome_text: failText,  moves_count: levelModel.numberOfMoves, level_shields: levelModel.acquiredMedals, collected_items: rewards})
            logTime(TIMERS.FEEDBACK);
            levelModel.loggedComplete = true;
        }
        return <>
            <div className='text-carnation text-3xl' style={{ fontFamily: 'Luckiest Guy' }}>{failTitle}</div>
            <div data-testid='not-won-modal' className="text-lg text-mineShaft text-center">You must achieve a Bronze<br />medal in order to advance<br />to the next level.</div>
            {levelModel.medalCriteria[0] && <div className="text-md my-2 py-2 px-4 bg-gallery text-mineShaft">
                <div className='font-semibold inline'>BRONZE: </div> {levelModel.medalCriteria[0].description}
            </div>}
            <RestartButton onClick={() => {
                logEvent("dismiss_sequence_feedback", {time_open: secsSinceLast(TIMERS.FEEDBACK)});
                restart();
            }} />
        </>
    })()
    
    return <div className='flex relative overflow-hidden' style={{ minHeight: '100vh', backgroundColor: '#576b91' }}>

        {/* Used in test */ levelModel.won && <div data-testid="win-msg" className="mt-5 text-red-600" hidden>Level Complete!</div>}

        {levelModel.complete && <Feedback style={{ fontFamily: 'sniglet' }}>{completedContent}</Feedback>}

        {(missionModal && storyText) && <MissionModal onClose={() => setMissionModal(false)} data-testid='mission-modal' creative={levelModel.creative} storyText={storyText}>
            <div className="flex flex-col items-center px-16 text-xl" style={{ whiteSpace: 'pre-line' }}>{storyText}</div>
        </MissionModal>}

        <SideMenu title='Legend' yPos={65} isOpen={openSideMenuIndex === 0} onTap={toggleLegend}>
            <div style={{ fontFamily: 'Sniglet' }} className='flex flex-col text-2xl'>
                {Object.values(REWARDS).map((rewardType, i) => {
                    return <div className='flex flex-row mb-5' key={i}>
                        <div key={rewardType}
                            className={'flex justify-center items-center text-white text-3xl'}
                            style={{ float: 'left', fontFamily: 'Luckiest Guy', backgroundImage: `url(${gemMap[rewardType]})`, width: '58px', height: '73px', zIndex: 3, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                        </div>
                        <div className='ml-2'>
                            {rewardType === 'blue' ? 'BLUE' : 'YELLOW'} GEM
                        </div>
                    </div>
                })}

                <div>
                    <div className="flex flex-row mb-5">
                        <GamePieceView scale={25} width={60} height={48}><Stamp stamp={{ vertices: scoringStamp, value: 1 }} /></GamePieceView>
                        <div className='ml-2'>STAMP: 1 point</div>
                    </div>
                    <div className="flex flex-row mb-5">
                        <GamePieceView scale={25} width={60} height={48}><Stamp stamp={{ vertices: scoringStamp, value: 2 }} /></GamePieceView>
                        <div className='ml-2'>STAMP: 2 points</div>
                    </div>
                </div>

                <div className='flex flex-row' style={{ zIndex: 15 }}>
                    <div className='flex flex-row justify-center'>

                        {Object.keys(shieldMap).map((medal, i) => {
                            return i !== 3 && <Medal
                                key={i} medal={shieldMap[medal]} style={{ marginLeft: i === 0 ? '0px' : -40 + 'px' }}
                            />
                        })}

                    </div>
                    <div className='ml-2' style={{ width: '170px' }}>
                        Shields: Bronze, Silver, and Gold
                    </div>
                </div>
            </div>
        </SideMenu>

        <SideMenu title='Objectives' isOpen={openSideMenuIndex === 1} onTap={toggleObjective} yPos={10} data-testid='scoring'>
            <div style={{ fontFamily: 'Sniglet', marginBottom: '15px' }} className="mt-1 text-yellow-600 text-2xl">
                {levelModel.description}
            </div>

            <div style={{ fontFamily: 'Carter One' }} className='uppercase font-bold'>Shields</div>
            {levelModel.medalCriteria.map((criteria, i) =>
                <div className='h-24 my-2' key={i}>
                    <div style={{ float: 'left', marginRight: '10px' }}> <Medal medal={shieldMap[criteria.medal]} /></div>
                    <div style={{ fontFamily: 'Sniglet' }}><span className='uppercase font-bold'> {criteria.medal}</span>: {criteria.description}</div>
                </div>
            )}
        </SideMenu>

        <div
            className="flex flex-col w-64 -ml-1 pl-5 pr-4 py-6 -my-4"
            style={{ backgroundImage: `url(${CodingBlocksBackground})`, backgroundSize: '100% 100%', fontFamily: 'Sniglet' }}
        >
            <button className='self-start my-2' data-testid='goto-level-select' onClick={onClickReturnButton}
                style={{ backgroundImage: `url(${BackToMap})`, backgroundSize: '100% 100%', fontFamily: 'Sniglet', width: '129px', height: '27px' }} />
            <MissionButton className={levelModel.complete ? 'z-0' : 'z-40'} onClick={onClickMissionButton}>Mission</MissionButton>
            <h2 className="uppercase text-white text-2xl mb-2 mt-4" style={{ fontFamily: 'Sniglet' }}>Coding Blocks</h2>
            <CodingBlocks disabled={isExecuting} addBlock={addBlock} insideLoop={!!levelModel.editLoop} availableBlocks={levelModel.availableBlocks} />
        </div>

        <div className='flex flex-1 flex-col items-center'>
            <div className="flex flex-col text-5xl my-4 text-white"
                style={{ fontFamily: 'Luckiest Guy, cursive', width: '300px', height: '115px' }} data-testid={'level-' + levelModel.number}>
                Level {levelModel.number} <div className="text-xl -mt-4" style={{ fontFamily: 'Sniglet' }}>{levelModel.title}</div>
            </div>
            <BlockSequence disabled={isExecuting} blocks={levelModel.blockQueue.queue}
                removeInstruction={removeInstruction}
                updateInstruction={updateInstruction}
                executeInstructions={executeInstructions}
                reorderInstructions={reorderInstructions}
                setEditLoop={setEditLoop}
                focusLoop={levelModel.editLoop}
            />
        </div>

        <div>
            <div className="relative mt-4 mb-2 flex justify-between text-white text-lg z-10" style={{ fontFamily: 'Luckiest Guy', marginRight: '11rem' }}>

                {/* Blocks */}
                <div className='flex flex-col items-center'>Blocks
                    <div data-testid='block-counter' className={'flex justify-center items-center text-3xl my-auto'}
                        style={{ backgroundImage: `url(${Coin})`, width: '63px', height: '67px', backgroundSize: '100% 100%' }}>
                        {levelModel.numberOfBlocksUsed}
                    </div>
                </div>

                {/* Moves */}
                <div className='flex flex-col items-center'>Moves
                    <div data-testid='number-of-moves' className={'flex justify-center items-center text-3xl my-auto'}
                        style={{ backgroundImage: `url(${Counter})`, width: '102px', height: '71px', backgroundSize: '100% 100%' }}>
                        {levelModel.numberOfMoves}
                    </div>
                </div>

                {/* Shields */}
                <div className='flex flex-col items-center'>Shields
                    <div className='flex flex-row justify-center w-24'>
                        {levelModel.acquiredMedals.length === 0 && <Medal medal={shieldMap[MEDALS.noMedal]} className='-mx-4' />}
                        {Object.keys(shieldMap).map((medal, i) => {
                            const acquired = levelModel.acquiredMedals.includes(medal)
                            return acquired ? <Medal key={i} medal={shieldMap[medal]} data-testid={medal + "-token"} className='-mx-4' /> : null
                        })}
                    </div>
                </div>

                {/* Stamp Points */}
                {levelModel.stamps.length > 0 &&
                    <div className='flex flex-col items-center'>Stamps
                        <div
                            data-testid='number-of-stamping-moves'
                            className={'flex justify-center items-center text-3xl my-auto'}
                            style={{ backgroundImage: `url(${StampIcon})`, paddingRight: '28px', width: '90px', height: '70px', backgroundSize: '100% 100%' }}>
                            {levelModel.getStampScore()}
                        </div>
                    </div>
                }

                {/* Gems */}
                {(levelModel.rewards.length > 0 || levelModel.collectedRewards.length > 0) &&
                    <div>
                        <div className='flex justify-center align-center'>Gems</div>
                        {Object.values(REWARDS).map((rewardType) =>
                            <div key={rewardType}
                                data-testid={rewardType + '-collected'} className={'flex justify-center items-center text-3xl'}
                                style={{ float: 'left', backgroundImage: `url(${gemMap[rewardType]})`, width: '62px', height: '83px', backgroundSize: '100% 100%' }}>
                                {levelModel.numberOfGemsCollected(rewardType)}
                            </div>
                        )}
                    </div>
                }

            </div>

            <PlayingField>
                <GridLines axisRange={levelModel.axisRange} />
                {levelModel.stamps.map((stamp, i) => <Stamp key={i} data-testid={'stamp-' + i} stamp={stamp} />)}
                {levelModel.obstacles.map((obstacle, i) => <Obstacle key={i} data-testid={'obstacle-' + i} obstacle={obstacle} />)}
                <AxisLines axisRange={levelModel.axisRange} />
                <PlayerToken playerToken={levelModel.playerToken} data-testid='player-token' />
                {levelModel.rewards.map((reward, i) => <Reward key={i} data-testid={'reward-' + i} reward={reward} />)}
                {levelModel.endGoal && <EndGoal data-testid='end-goal' endGoal={levelModel.endGoal} />}
            </PlayingField>
        </div>

    </div >

}

export default LevelContainer;