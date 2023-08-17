import './assertions'
import React from 'react'
import { testLevel1, testLevel2, completeTestLevel1WithBronzeDOM, navigateFromLevelPage, goToLevelSelect } from './fixtures'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from "../App"

describe('Level Progression Component', () => {

  const levels = [testLevel1, testLevel2]

  it('should only have level 1 enabled by default', async () => {
    let { getByText, getByTestId } = render(<App levels={levels} RouterComponent={MemoryRouter} />)
    await goToLevelSelect(getByTestId)
    expect(getByTestId('select-level-1')).toHaveClass('cursor-pointer')
    expect(getByTestId('select-level-2')).not.toHaveClass('cursor-pointer')
  })

  it('should enable level 2 after attaining at least bronze on level 1', async () => {
    let { getByTestId } = render(<App levels={levels} RouterComponent={MemoryRouter} />)
    await goToLevelSelect(getByTestId)
    expect(getByTestId('select-level-1')).toHaveClass('cursor-pointer')
    expect(getByTestId('select-level-2')).not.toHaveClass('cursor-pointer')
    await completeTestLevel1WithBronzeDOM(getByTestId)
    await navigateFromLevelPage(getByTestId)
    const nextLevel = getByTestId('select-level-2')
    expect(nextLevel).toHaveClass('cursor-pointer')
    fireEvent.click(nextLevel)
    expect(getByTestId('level-2'))
  })

  it('should remember medal attained on level 1 after returning to it', async () => {
    let { getByText, getByTestId } = render(<App levels={levels} RouterComponent={MemoryRouter} />)
    await completeTestLevel1WithBronzeDOM(getByTestId)
    await navigateFromLevelPage(getByTestId, 2)
    await navigateFromLevelPage(getByTestId, 1)
    expect(getByTestId('bronze-token'))
  })

  it('should not allow you to navigate to a level you don\'t have access to yet', async () => {
    let { getByText, getByTestId } = render(<App levels={levels} RouterComponent={MemoryRouter} />)
    await goToLevelSelect(getByTestId)
    fireEvent.click(getByTestId('select-level-2'))
    expect(getByTestId('select-level-2')) // you didn't go anywhere
  })

  it('after successfully completing a level, the user should be able to click on [proceed to next level] to go to the next level', async () => {
    let { getByText, getByTestId } = render(<App levels={levels} RouterComponent={MemoryRouter} />)
    await completeTestLevel1WithBronzeDOM(getByTestId)
    const nextLevel = getByTestId('next-level')
    await navigateFromLevelPage(getByTestId, 2)
    fireEvent.click(nextLevel)
    expect(getByTestId('level-2'))
  })
})