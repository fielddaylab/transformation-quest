import React, { useState } from 'react'
import { useHistory } from "react-router-dom"

import {getSessionId} from "../model/dataCollectionApi"

import BronzeShield from '../assets/bronzeShield.svg'
import SilverShield from '../assets/silverShield.svg'
import GoldShield from '../assets/goldShield.svg'
import { MissionModal } from './uiComponents'
import _ from "lodash";
import CodeParchment from "../assets/codeParchment.svg"
import Paper from '../assets/MAP-SVGs/mapBackground.svg'
import AvailableTriangle from '../assets/MAP-SVGs/blueTriangle.svg'
import DisabledTriangle from '../assets/MAP-SVGs/greyTriangle.svg'

import Blue1 from '../assets/MAP-SVGs/1Blue.svg'
import Blue2 from '../assets/MAP-SVGs/2Blue.svg'
import Blue3 from '../assets/MAP-SVGs/3Blue.svg'
import Blue4 from '../assets/MAP-SVGs/4Blue.svg'
import Blue5 from '../assets/MAP-SVGs/5Blue.svg'
import Blue6 from '../assets/MAP-SVGs/6Blue.svg'
import Blue7 from '../assets/MAP-SVGs/7Blue.svg'
import Blue8 from '../assets/MAP-SVGs/8Blue.svg'
import Blue9 from '../assets/MAP-SVGs/9Blue.svg'
import Blue10 from '../assets/MAP-SVGs/10Blue.svg'
import Blue11 from '../assets/MAP-SVGs/11Blue.svg'

import Grey1 from '../assets/MAP-SVGs/1Grey.svg'
import Grey2 from '../assets/MAP-SVGs/2Grey.svg'
import Grey3 from '../assets/MAP-SVGs/3Grey.svg'
import Grey4 from '../assets/MAP-SVGs/4Grey.svg'
import Grey5 from '../assets/MAP-SVGs/5Grey.svg'
import Grey6 from '../assets/MAP-SVGs/6Grey.svg'
import Grey7 from '../assets/MAP-SVGs/7Grey.svg'
import Grey8 from '../assets/MAP-SVGs/8Grey.svg'
import Grey9 from '../assets/MAP-SVGs/9Grey.svg'
import Grey10 from '../assets/MAP-SVGs/10Grey.svg'
import Grey11 from '../assets/MAP-SVGs/11Grey.svg'

const textDistance = 45, shieldDistance = 80
const toRad = v => - (v * Math.PI / 180)
const congratulations = 'Congratulations! What a journey. You’ve managed to deliver the protective gems and stop the invasion from planet Smreg. The queen, on behalf of the people of Adanac, thanks you for saving them!'

const shieldMap = {
  'bronze': BronzeShield,
  'silver': SilverShield,
  'gold': GoldShield,
}

const mapData = [

  { x: 110, y: 400, textDirection: toRad(0), shieldDirection: toRad(90), enabledNummber: Blue1, disabledNumber: Grey1 },
  { x: 200, y: 600, textDirection: toRad(20), shieldDirection: toRad(88), enabledNummber: Blue2, disabledNumber: Grey2 },
  { x: 470, y: 650, textDirection: toRad(0), shieldDirection: toRad(85), enabledNummber: Blue3, disabledNumber: Grey3 },
  { x: 350, y: 410, textDirection: toRad(-90), shieldDirection: toRad(130), enabledNummber: Blue4, disabledNumber: Grey4 },
  { x: 500, y: 270, textDirection: toRad(5), shieldDirection: toRad(90), enabledNummber: Blue5, disabledNumber: Grey5 },
  { x: 320, y: 150, textDirection: toRad(160), shieldDirection: toRad(90), enabledNummber: Blue6, disabledNumber: Grey6 },
  { x: 650, y: 75, textDirection: toRad(15), shieldDirection: toRad(140), enabledNummber: Blue7, disabledNumber: Grey7 },
  { x: 660, y: 270, textDirection: toRad(180), shieldDirection: toRad(70), enabledNummber: Blue8, disabledNumber: Grey8 },
  { x: 820, y: 340, textDirection: toRad(-5), shieldDirection: toRad(90), enabledNummber: Blue9, disabledNumber: Grey9 },
  { x: 580, y: 500, textDirection: toRad(170), shieldDirection: toRad(90), enabledNummber: Blue10, disabledNumber: Grey10 },
  { x: 800, y: 550, textDirection: toRad(-15), shieldDirection: toRad(90), enabledNummber: Blue11, disabledNumber: Grey11 },
]

const LevelTriangle = ({ x, y, disabled, onClick, ...rest }) =>
  <image x={x - 27} y={y - 27} onClick={disabled ? null : onClick} className={disabled ? '' : 'cursor-pointer'} href={disabled ? DisabledTriangle : AvailableTriangle} {...rest} />

const LevelSelector = ({ levelProgression }, { reactLogger }) => {
  let history = useHistory()
  const gameComplete = _.last(levelProgression.levels).acquiredMedals.length > 0 // has acquired any medal on the last level
  const [missionModal, setMissionModal] = useState(gameComplete && !levelProgression.hasCompletedGame)
  if(gameComplete) levelProgression.hasCompletedGame = true
  let sessionId = getSessionId()

  const onClickLevel = (number) => {
    // TODO: verify shield fetch
    let shields = levelProgression.levels[number].acquiredMedals;
    reactLogger.log("select_level", {level: number, level_shields: shields})
    history.push('/level/' + number)
  }

  return <div className='flex justify-center items-center bg-canvas h-screen' style={{backgroundColor: '#71c0ce'}}>

    {missionModal && <MissionModal onClose={() => setMissionModal(false)}>
      <div className="flex flex-col items-center px-16 text-xl" style={{ whiteSpace: 'pre-line' }}>{congratulations}</div>
    </MissionModal>}

    { sessionId && 
      <div
        className={'fixed top-0 left-0 flex flex-col justify-between items-center p-6 pb-8'}
        style={{
            backgroundImage: `url(${CodeParchment})`, height: '400px', width: '360px',
            paddingTop: '275px', transform: 'translate(20px, -200px)'
        }}
      >
        <div>Use the code</div>
        <div className='font-bold'>{ sessionId }</div>
        <div>to continue this game later!</div>
      </div>
    }

    <img src={Paper} alt="Parchment Paper" className='h-full w-auto' />
    <svg viewBox="0 0 892 703" className='fixed top-0 left-20 h-full' style={{ width: '70%' }}>
      {levelProgression.levels.map(({ number, acquiredMedals }, i) => {
        const canPlay = levelProgression.canPlay(number), canPlayNext = levelProgression.canPlay(number + 1), id = 'select-level-' + number
        const pos = mapData[number - 1], nextPos = mapData[number]
        if (!pos) return null
        const textPos = {
          x: pos.x + (Math.cos(pos.textDirection) * textDistance),
          y: pos.y + (Math.sin(pos.textDirection) * textDistance)
        }
        const shieldPos = {
          x: pos.x + (Math.cos(pos.shieldDirection) * shieldDistance),
          y: pos.y + (Math.sin(pos.shieldDirection) * shieldDistance)
        }
        return <React.Fragment key={i}>
          {nextPos && <line x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y} stroke={canPlayNext ? 'black' : "#999999"} strokeWidth='3' strokeDasharray="15 10" strokeLinecap="round" />}
          <LevelTriangle x={pos.x} y={pos.y} data-testid={id} onClick={onClickLevel(number)} disabled={!canPlay} />
          <image x={textPos.x - 12} y={textPos.y - 15} href={canPlay ? pos.enabledNummber : pos.disabledNumber} />
          {acquiredMedals.map((medal, i) => <image key={i} x={shieldPos.x + (13 * (i-1))} y={shieldPos.y} href={shieldMap[medal]} height='50px' width='36px' />)}
        </React.Fragment>
      })}
    </svg>
  </div>
}

export default LevelSelector