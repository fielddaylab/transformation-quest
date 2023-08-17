import React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import SandboxModel from '../model/sandboxModel'
import SandboxContainer from '../components/sandbox/sandboxContainer'
import { Circle } from '../model/shapes'
import AxisRange from '../model/axisRange'
import './assertions'

describe('Sandbox Container tests', () => {

    let sandboxModel
    beforeEach(() => {
        sandboxModel = new SandboxModel({
            playerToken: new Circle({ x: 1, y: 2 }),
        })
    })

    describe('Translation Container', () => {

        test('Should be able to translate to the right', async () => {

            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            fireEvent.click(getByText('Go Right'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '2')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '2')
        })

        test('Should be able to translate to the left', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')


            fireEvent.click(getByText('Go Left'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '0')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '2')
        })

        test('Should be able to translate down', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')


            fireEvent.click(getByText('Go Down'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '1')
        })

        test('Should be able to translate up', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')


            fireEvent.click(getByText('Go Up'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '3')
        })

        test('Should be able to translate in the Y direction by 2 units using the input box', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const input = getByTestId('amount-input')
            fireEvent.change(input, { target: { value: '2' } })

            fireEvent.click(getByText('Go Down'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '0')
        })

        test('Should be able to translate in the Y direction by 3 units upwards using the input box', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const input = getByTestId('amount-input')
            fireEvent.change(input, { target: { value: '3' } })

            fireEvent.click(getByText('Go Up'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '5')
        })

        test('Should be able to translate in the X direction by 2 to the left units using the input box', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const input = getByTestId('amount-input')
            fireEvent.change(input, { target: { value: '2' } })

            fireEvent.click(getByText('Go Left'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '-1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '2')
        })

        test('Should be able to translate in the Y direction by 3 units to the right using the input box', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const input = getByTestId('amount-input')
            fireEvent.change(input, { target: { value: '3' } })

            fireEvent.click(getByText('Go Right'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '4')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '2')
        })

        test('Expect out of bounds error when moving out of grid range', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const input = getByTestId('amount-input')
            fireEvent.change(input, { target: { value: '50' } })

            fireEvent.click(getByText('Go Right'))
            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            expect(getByText('Your triangle has gone out of bounds.'))
        })

    })

    describe('Rotation Container', () => {

        test('Should be able to rotate 90 degrees', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            fireEvent.click(getByText('Rotate 90 Degrees'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '-2')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '1')
        })

        test('Should be able to rotate 180 degrees', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const input = getByTestId('amount-input')

            fireEvent.click(getByText('Rotate 180 Degrees'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '-1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '-2')
        })

        test('Should be able to rotate 270 degrees', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const input = getByTestId('amount-input')

            fireEvent.click(getByText('Rotate 270 Degrees'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '2')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '-1')
        })

        test('Should be able to rotate around given point using the input box', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            const pointInput = getByTestId('center-input')
            fireEvent.change(pointInput, { target: { value: '1,1' } })

            fireEvent.click(getByText('Rotate 90 Degrees'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '0')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '1')
        })
    })

    describe('Reflection Container', () => {
        test('Should be able to reflect about the x-axis', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            fireEvent.click(getByText('Reflect About X-axis'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '-2')
        })

        test('Should be able to reflect about the y-axis', async () => {
            let { getByText, getByTestId } = render(<SandboxContainer sandboxModel={sandboxModel} />)
            const beforeClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(beforeClickPlayerCircle).toHaveAttribute('cx', '1')
            expect(beforeClickPlayerCircle).toHaveAttribute('cy', '2')

            fireEvent.click(getByText('Reflect About Y-axis'))

            const afterClickPlayerCircle = await waitForElement(() => getByTestId('player-token'))
            expect(afterClickPlayerCircle).toHaveAttribute('cx', '-1')
            expect(afterClickPlayerCircle).toHaveAttribute('cy', '2')
        })
    })

})