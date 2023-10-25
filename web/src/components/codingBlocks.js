import React from 'react'
import * as  Blocks from '../model/blocks'

const defaultBlockCreation = [
  () => Blocks.createHorizontalTranslation(1),
  () => Blocks.createVerticalTranslation(1),
  Blocks.createClockwise90DegreeRotation,
  Blocks.createCounterClockwise90DegreeRotation,
  Blocks.createClockwise90DegreeRotationArg,
  Blocks.createCounterClockwise90DegreeRotationArg,
  Blocks.createReflectX,
  Blocks.createReflectY,
  Blocks.createReflectYWithLine,
  Blocks.createReflectXWithLine,
  () => Blocks.createLoop(2)
]

const CodingBlock = ({ disabled, addBlock, insideLoop, availableBlocks }) =>
  defaultBlockCreation
    .map(fn => fn())
    .filter(({ type }) => availableBlocks.includes(type))
    .map((block, i) => {
      const isLoop = block.type === Blocks.BLOCK_TYPES.repeat
      return <button
        key={i} className="btn-instructions" data-testid={block.type}
        onClick={() => addBlock(block)} disabled={disabled || (isLoop && insideLoop)}
      >
        <div className='flex flex-col'>{block.description.map((d, i) => <React.Fragment key={i}>{d}<br /></React.Fragment>)}</div>
        {block.amounts.length === 1 && <div className='myinput h-8 mr-2' />}
        {block.amounts.length === 2 && <div className='flex items-center text-2xl mr-1'>
          (<div className='myinput h-8 mx-1' />,<div className='myinput h-8 mx-1' />)
        </div>}
      </button>
    })

export default CodingBlock