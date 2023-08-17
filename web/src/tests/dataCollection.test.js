import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, fireEvent, waitForElement, getByText as domGetByText, getByTestId as domGetByTestId } from '@testing-library/react'
import { setEndpoint, endSession } from '../model/dataCollectionApi'
import MockCollectionEndpoint from './mockDataCollectionEndpoint'
import { testLevel2, testLevel1, completeTestLevel1WithBronzeDOM, goToLevel, navigateFromLevelPage } from './fixtures'
import App from '../App'

describe('App data collection', () => {

    let mockCollectionEndpoint

    beforeEach((done) => {
        endSession()
        mockCollectionEndpoint = new MockCollectionEndpoint()
        setEndpoint(mockCollectionEndpoint)
        done()
    })

    it('Should request a session during app load', async () => {
        let { getByTestId } = render(<App RouterComponent={MemoryRouter} />)
        await goToLevel(getByTestId, 1)
        await waitForElement(() => getByTestId('player-token'))
        expect(mockCollectionEndpoint.startedSessionCount).toEqual(1)
    })

    it('Should log a startLevel event', async () => {
        let { getByTestId } = render(<App RouterComponent={MemoryRouter} levels={[testLevel1, testLevel2]} />)
        await goToLevel(getByTestId, 1)
        await waitForElement(() => getByTestId('player-token'))
        await completeTestLevel1WithBronzeDOM(getByTestId, true)

        await navigateFromLevelPage(getByTestId)
        fireEvent.click(getByTestId('select-level-2'))
        await waitForElement(() => getByTestId('level-2'))

        expect(mockCollectionEndpoint.selectedLevels.length).toEqual(2)
        expect(mockCollectionEndpoint.selectedLevels[0]).toEqual('testLevel1')
        expect(mockCollectionEndpoint.selectedLevels[1]).toEqual('testLevel2')
        expect(mockCollectionEndpoint.startedSessionCount).toEqual(1)
    })

    it('Should log a runLevel event', async () => {
        let { getByTestId } = render(<App RouterComponent={MemoryRouter} />)
        await goToLevel(getByTestId, 1)
        let upButton = await waitForElement(() => getByTestId('y-translate'))
        fireEvent.click(upButton)

        let goButton = await waitForElement(() => getByTestId('go-button'))
        fireEvent.click(goButton)

        await waitForElement(() => {
            let goButtonClicked = getByTestId('go-button')
            expect(goButtonClicked).toHaveAttribute('disabled')
            return goButtonClicked
        })

        expect(mockCollectionEndpoint.runEvents.length).toEqual(1)

    })
})
