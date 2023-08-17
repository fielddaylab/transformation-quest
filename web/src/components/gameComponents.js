import React from 'react'
import _ from 'lodash'
import { centroidOfTriangle } from '../model/math'
import Parchment from '../assets/gridParchment.svg'
import BlueGem from '../assets/blueGem.svg'
import YellowGem from '../assets/yellowGem.svg'
import { REWARDS } from '../model/levelModel'

const shapeStyle = { fill: "red", stroke: "black", strokeWidth: "0.03" }

const stampColourMap = {
  1: '#663399',
  2: '#FFD700',
}

const stampStrokeColourMap = {
  1: '#8657b3',
  2: '#fa9f02',
}

export const verticesToSVGPoints = vertices => vertices.map(p => p.x + ',' + p.y).join(' ')

export const rectToVerticies = ({ x, y, width, height }) => [{ x, y }, { x: x + width, y }, { x: x + width, y: y - height }, { x, y: y - height }]

export const rectToSVGPoints = rect => verticesToSVGPoints(rectToVerticies(rect))

export const Shape = ({ vertices, ...rest }) => {
  return vertices.length === 1
    ? <circle {...rest} cx={vertices[0].x} cy={vertices[0].y} r="0.2" />
    : <polygon {...rest} points={verticesToSVGPoints(vertices)} />
}

export const PlayerToken = ({ playerToken, ...rest }) => <Shape {...rest} vertices={playerToken.vertices} style={{ ...shapeStyle }} />

export const EndGoal = ({ endGoal, ...rest }) => <Shape {...rest} vertices={endGoal.vertices} style={{ ...shapeStyle, fill: "transparent", strokeDasharray: "0.2 0.2" }} />

export const getStampColour = stamp => stampColourMap[stamp.value] + (stamp.collected ? 'FF' : '55')

export const Stamp = ({ stamp, ...rest }) => {
  const textPos = stamp.collected ? centroidOfTriangle(stamp.vertices) : null
  let style = { ...shapeStyle, fill: getStampColour(stamp), strokeDasharray: "0.2 0.2" }
  const collectedStyle = { stroke: stampStrokeColourMap[stamp.value], strokeDasharray: null, strokeWidth: "0.08" }
  if (stamp.collected) style = { ...style, ...collectedStyle }
  return <>
    <Shape {...rest} vertices={stamp.vertices} style={style} />
    {textPos && <text textAnchor="middle" x={textPos.x} y={-textPos.y + 0.3} fill='white' fontSize="0.7" transform="scale(1,-1)">{stamp.value}</text>}
  </>
}

export const Obstacle = ({ obstacle, style, ...rest }) => {
  if (obstacle.img) return <image {...rest} href={obstacle.img} width={obstacle.width} transform={`scale(1 -1) translate(${obstacle.x} ${-obstacle.y})`} />
  return <polygon {...rest} points={rectToSVGPoints(obstacle)} style={{ fill: "lightblue" }} />
}

export const gemMap = {
  [REWARDS.blue]: BlueGem,
  [REWARDS.yellow]: YellowGem,
}

// Parameters cx and cy were added strictly for testing
export const Reward = ({ reward: { x, y, type }, style, ...rest }) => {
  return <image {...rest} cx={x} cy={y} href={gemMap[type]} width={1} transform={`scale(1 -1) translate(${x - 0.5} ${-y - 0.55})`}></image>
}

const axisMajor = { stroke: "#222222", strokeWidth: "0.06" }
const axisMinor = { stroke: "#222222", strokeWidth: "0.01" }
export const defaultScale = 27.3

export const AxisLines = ({ axisRange: { minX: min, maxX: max } }) => <>
  <path style={axisMajor} d={`M ${min}.5,0 ${max}.5,0`} />
  <path style={axisMajor} d={`M 0,${min}.5 0,${max}.5`} />
  <path style={axisMajor} d={`M ${min}.8,0 ${min}.5,0.1 ${min}.5,-0.1 Z`} />
  <path style={axisMajor} d={`M ${max}.8,0 ${max}.5,0.1 ${max}.5,-0.1 Z`} />
  <path style={axisMajor} d={`M 0,${min}.8 0.1,${min}.5 -0.1,${min}.5 Z`} />
  <path style={axisMajor} d={`M 0,${max}.8 0.1,${max}.5 -0.1,${max}.5 Z`} />
  {_.range(min, max + 1).map(i => <React.Fragment key={'text-' + i}>
    <text x={i - 0.1} y="0.4" textAnchor="end" fontStyle="italic" fontSize="0.4" transform="scale(1,-1)">{i}</text>
    <text x="-0.1" y={-i + 0.4} textAnchor="end" fontStyle="italic" fontSize="0.4" transform="scale(1,-1)">{i}</text>
  </React.Fragment>)}
</>

export const GridLines = ({ axisRange: { minX: min, maxX: max } }) =>
  _.range(min, max + 1).map(i => <React.Fragment key={'line-' + i}>
    <path style={axisMinor} d={`M ${min},${i} ${max},${i}`} />
    <path style={axisMinor} d={`M ${i},${min} ${i},${max}`} />
  </React.Fragment>)

export const PlayingField = ({ children }) =>
  <div className='relative flex justify-center items-center p-8 -mb-8 z-10' style={{ backgroundImage: `url(${Parchment})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
    <svg className='relative z-10' width="600" height="600"><g transform={`scale(${defaultScale}, -${defaultScale}) translate(11,-11) `}>{children}</g></svg>
  </div>

export const GamePieceView = ({ children, scale = defaultScale, width = "90", height = "60", ...rest }) =>
  <svg {...rest} width={width} height={height}> <g transform={`scale(${scale}, -${scale})`}>{children}</g></svg>