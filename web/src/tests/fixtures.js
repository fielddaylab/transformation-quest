import LevelModel, { REWARDS, MEDALS } from "../model/levelModel"
import { Circle } from "../model/shapes"
import * as Blocks from '../model/blocks'
import { fireEvent, waitForElement, getByTestId } from '@testing-library/react'

export const testLevel1 = new LevelModel({
  id: 'testLevel1',
  playerToken: new Circle({ x: 0, y: 0 }),
  endGoal: new Circle({ x: 0, y: 5 }),
  rewards: [{ type: REWARDS.blue, x: 0, y: 1 }, { type: REWARDS.blue, x: 0, y: 2 }, { type: REWARDS.blue, x: 0, y: 3 }],
  medalCriteria: [
    { medal: MEDALS.bronze, attained: levelModel => levelModel.collectedRewards.length > 0 },
    { medal: MEDALS.silver, attained: levelModel => levelModel.collectedRewards.length > 1 },
    { medal: MEDALS.gold, attained: levelModel => levelModel.collectedRewards.length > 2 },
  ]
})

export const testLevel2 = new LevelModel({
  ...testLevel1,
  id: 'testLevel2',
  endGoal: new Circle({ x: 0, y: 6 }),
})

export const completeTestLevel1WithBronze = level1 => {
  const levelModels = level1
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(4))
    .execute()
  return levelModels[levelModels.length - 1]
}

// Go to level from the title page
export const goToLevel = async (getByTestId, level) => {
  // try { fireEvent.click(getByTestId('goto-level-select')) }
  try {await goToLevelSelect(getByTestId)}
  catch (e) { }
  fireEvent.click( await waitForElement(() => getByTestId('select-level-' + level)))
}

export const goToLevelSelect = async (getByTestId) => {
  fireEvent.click(getByTestId('start-button'))
  fireEvent.click(await waitForElement(() => getByTestId('next-button-0')))
  fireEvent.click(await waitForElement(() => getByTestId('next-button-1')))
  fireEvent.click(await waitForElement(() => getByTestId('next-button-2')))  
}

// Go to level from a level page
export const navigateFromLevelPage = async (getByTestId, level) => {
  fireEvent.click(getByTestId('goto-level-select'))
  if(level)
    fireEvent.click( await waitForElement(() => getByTestId('select-level-' + level)))
}

export const completeTestLevel1WithBronzeDOM = async (getByTestId, inLevel1) => {
  if (!inLevel1) await goToLevel(getByTestId, 1)
  let translateButton = await waitForElement(() => getByTestId('y-translate'))
  fireEvent.click(translateButton)
  fireEvent.click(translateButton)
  fireEvent.change(getByTestId('step-input-0-0'), { target: { value: '1' } })
  fireEvent.change(getByTestId('step-input-1-0'), { target: { value: '4' } })
  fireEvent.click(getByTestId('go-button'))
  await waitForElement(() => getByTestId('won-modal'))
}


export const completeTestLevel1WithSilver = level1 => {
  const levelModels = level1
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(3))
    .execute()
  return levelModels[levelModels.length - 1]
}

export const completeTestLevel1WithGold = level1 => {
  const levelModels = level1
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(2))
    .execute()
  return levelModels[levelModels.length - 1]
}

export const completeTestLevel2WithBronze = level2 => {
  const levelModels = level2
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(5))
    .execute()
  return levelModels[levelModels.length - 1]
}

export const completeTestLevel2WithSilver = level2 => {
  const levelModels = level2
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(4))
    .execute()
  return levelModels[levelModels.length - 1]
}

export const completeTestLevel2WithGold = level2 => {
  const levelModels = level2
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(1))
    .addBlock(Blocks.createVerticalTranslation(3))
    .execute()
  return levelModels[levelModels.length - 1]
}

