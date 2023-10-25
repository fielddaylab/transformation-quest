import React from 'react'
import { Block, LoopBlock, BLOCK_TYPES } from '../model/blocks'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import BlockSequenceBackground from '../assets/headerBar.svg'
import RunButton from '../assets/runButton.svg'

const LoopStep = ({ block, setEditLoop, focusLoop, removeInstruction, updateInstruction, disabled, index, forDroppable }) => {
  let loopDroppableName = forDroppable + '-' + index
  let hasFocus = block === focusLoop
  return <div className={'py-2 ' + (hasFocus ? 'bg-jellyBean shadow-xl' : 'bg-loopBackground')}>

    <div className='flex justify-between mx-2'>
      <div className='flex items-center ml-2 text-white'>{block.description}</div>
      <button className="bg-white text-black px-2 hover:text-red-600 shadow-md text-xl text-fiord" disabled={disabled}
        onClick={() => removeInstruction(block)} data-testid={'remove-' + index} >x</button>
    </div>

    <Droppable droppableId={loopDroppableName} type={loopDroppableName}>
      {(provided, snapshot) =>
        <div ref={provided.innerRef} {...provided.droppableProps} >
          {block.blockQueue.queue.map((block, i) => (
            <div className='' key={index + '-' + i}>
              <Step
                block={block}
                updateInstruction={updateInstruction}
                removeInstruction={removeInstruction}
                setEditLoop={setEditLoop}
                forDroppable={loopDroppableName} focusLoop={focusLoop}
                index={i} disabled={disabled} />
            </div>
          ))}
          {provided.placeholder}
        </div>
      }
    </Droppable>
    {<div className=""><InsertMaker focus={focusLoop === block} onPress={() => setEditLoop(block)} /></div>}

    {!block.isAmountValid() && (<div className="ml-2 mb-2 text-red-600 italic text-sm" >Please enter an integer ≥ 2</div>)}
    <div className='flex justify-content space-between mx-2'>
      <div className='flex items-center ml-auto text-white'>Repeat</div>
      <input
        className='myinput w-10 h-8 ml-3' data-testid={'step-input-' + loopDroppableName}
        disabled={disabled} name="loopAmount" min="2" value={block.amounts[0] + ''}
        onChange={(e) => updateInstruction(block, new LoopBlock({ ...block, amounts: [e.target.value] }))}
      />
    </div>

  </div>
}



const SingleStep = ({ block, removeInstruction, updateInstruction, disabled, index }) => {

  const amounts = block.amounts
  const blockAmountToInput = i => {
    const amount = amounts[i]
    return <input
      key={index + '-' + i} data-testid={'step-input-' + index + '-' + i}
      className='myinput w-10 h-full mx-1'
      disabled={disabled} name="translationAmount" min="1" value={amount + ''}
      onChange={e => {
        const amounts = [...block.amounts]
        amounts[i] = e.target.value
        return updateInstruction(block, new Block({ ...block, amounts }))
      }}
    />
  }

  return <div className='flex flex-col bg-steelGrey mx-2 p-2 pl-3 text-fiord'>

    <div className='flex justify-between items-center h-8'>
      <div className='flex flex-col items-center text-sm'>
        {block.description.map((d, i) => <React.Fragment key={i}>{d}<br /></React.Fragment>)}
      </div>
      <div className='flex h-8'>
        {amounts.length === 1 && blockAmountToInput(0)}
        {block.amounts.length === 2 && <div className='flex items-center text-2xl'>
          ({blockAmountToInput(0)},{blockAmountToInput(1)})
        </div>}
        <button
          className="pr-1 pl-3 text-center hover:text-red-600 text-xl" disabled={disabled}
          onClick={() => removeInstruction(block)} data-testid={'remove-' + index}
        >x</button>
      </div>
    </div>

    {!block.isAmountValid() && <div className="mt-2 text-red-600 italic text-sm" >Please enter a valid integer</div>}

  </div>

}
const Step = props =>
  <Draggable draggableId={props.forDroppable + '-' + props.index} index={props.index} isDragDisabled={props.disabled}>
    {(provided) => {
      const Step = props.block.type === BLOCK_TYPES.repeat ? LoopStep : SingleStep
      return <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='py-2'><Step {...props} /></div>
    }}
  </Draggable>

const InsertMaker = ({ onPress, focus }) =>
  <div
    onClick={onPress}
    className={"flex justify-center inner-shadow-lg p-2 my-3 mx-2 italic cursor-pointer " +
      (focus ? "border-runOrange bg-salmonBlue border-2 text-moltenGrey" : "border-moltenGrey bg-cadetBlue border text-white")}
  >
    {focus ? 'Select Coding Block' : 'Click to activate'}
  </div>

const BlockSequence = ({ blocks, focusLoop, reorderInstructions, executeInstructions, setEditLoop, removeInstruction, updateInstruction, disabled }) => {

  function reorderInstructionArray(blocks, moveFrom, moveTo) {
    const [removed] = blocks.splice(moveFrom, 1)
    blocks.splice(moveTo, 0, removed)
    return blocks
  }

  function findParentLoopBlockByDragId(dragId) {
    let indices = dragId.split('-')
    indices.shift() // swallow "root"
    let blockArray = blocks
    let loopBlock
    while (indices.length > 0) {
      let blockIndex = Number(indices.shift())
      loopBlock = blockArray[blockIndex]
      blockArray = loopBlock.blockQueue.queue
    }
    return loopBlock
  }

  function onDragEnd(dragEvent) {
    if (!dragEvent.destination) return
    const moveFrom = dragEvent.source.index
    const moveTo = dragEvent.destination.index
    if (dragEvent.type === 'root') {
      reorderInstructions(reorderInstructionArray(blocks, moveFrom, moveTo))
    }
    else {
      let loopBlock = findParentLoopBlockByDragId(dragEvent.type)
      let newBlocks = reorderInstructionArray(loopBlock.blockQueue.queue, moveFrom, moveTo)
      let reorderedLoop = loopBlock.reorderBlocks(newBlocks)
      updateInstruction(loopBlock, reorderedLoop)
    }
  }

  function allLoopsRepeatsAtLeastTwice() {
    if (blocks) {
      let i = 0
      for (i; i < blocks.length; i++) {
        let block = blocks[i]
        if (block && block.type === BLOCK_TYPES.repeat) {
          if (block.getLoopAmount() <= 1) return false
        }
      }
    }
    return true
  }

  let hasFocus = !focusLoop
  const anyBlocksInvalid = b => b.some(block => !block.isAmountValid() || (block.type === BLOCK_TYPES.repeat ? anyBlocksInvalid(block.blockQueue.queue) : false))
  allLoopsRepeatsAtLeastTwice()
  let canExecute = !disabled && allLoopsRepeatsAtLeastTwice() && blocks.length > 0 && !anyBlocksInvalid(blocks)

  return <>

    <div className="mb-1 text-white flex justify-center items-center w-full text-xl"
      style={{
        fontFamily: 'Sniglet', backgroundImage: `url(${BlockSequenceBackground})`, backgroundSize: '100% 100%', height: '53px'
      }}>BLOCK SEQUENCE</div>

    <div className={"flex flex-col overflow-y-auto blockInset " + (hasFocus ? 'bg-jellyBean' : 'bg-gray-500')} style={{ height: '510px' }}>
      <div className="flex flex-1 flex-col" style={{ minWidth: '300px', maxWidth: '300px' }}>
        <div className={"flex-col p-4 items-stretch"} style={{ fontFamily: 'Sniglet' }} >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="root" type="root">
              {(provided, snapshot) => (
                <div className="w-full" data-testid='queue-box' ref={provided.innerRef} {...provided.droppableProps} >
                  {blocks && blocks.map((block, i) => (
                    <Step
                      key={i} block={block} forDroppable='root' focusLoop={focusLoop} index={i} disabled={disabled}
                      removeInstruction={removeInstruction}
                      updateInstruction={updateInstruction}
                      setEditLoop={setEditLoop}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {}
          </DragDropContext>
          <InsertMaker focus={!focusLoop} onPress={() => setEditLoop(null)} />
        </div>
      </div>
    </div>

    <div
      data-testid='go-button' disabled={!canExecute} onClick={executeInstructions}
      className={'flex justify-center items-center text-black mt-4'}
      style={{
        backgroundImage: `url(${RunButton})`, fontFamily: 'Sniglet', width: '220px', height: '55px', zIndex: 3, cursor: 'pointer',
        backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', pointerEvents: !canExecute ? 'none' : 'auto', opacity: !canExecute ? '0.7' : '1'
      }}>Run Sequence</div>

  </>
}

export default BlockSequence