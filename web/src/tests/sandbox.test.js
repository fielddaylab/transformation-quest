import SandboxModel from '../model/sandboxModel'
import AxisRange from '../model/axisRange'
import { Polygon } from '../model/shapes'
import './assertions'

describe('Create a sandbox model', () => {

    let sandboxModel
    beforeEach(() => {
        sandboxModel = new SandboxModel({
            playerToken: new Polygon([{ x: 3, y: 5 }, { x: 3, y: 8 }, { x: 0, y: 8 }])
        })
    })

    test('Should be able to translate in the x direction to the right', () => {
        let newModel = sandboxModel.translateX({ dx: 5 })

        let playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)
        let vertices = playerToken.vertices

        expect(vertices[0]).vertexEquals({ x: 8, y: 5 })
        expect(vertices[1]).vertexEquals({ x: 8, y: 8 })
        expect(vertices[2]).vertexEquals({ x: 5, y: 8 })
    })

    test('Should be able to translate in the x direction to the left', () => {
        let newModel = sandboxModel.translateX({ dx: -5 })

        let playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)
        let vertices = playerToken.vertices

        expect(vertices[0]).vertexEquals({ x: -2, y: 5 })
        expect(vertices[1]).vertexEquals({ x: -2, y: 8 })
        expect(vertices[2]).vertexEquals({ x: -5, y: 8 })
    })

    test('Should be able to translate in the y direction upwards', () => {
        let newModel = sandboxModel.translateY({ dy: 2 })

        let playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)
        let vertices = playerToken.vertices

        expect(vertices[0]).vertexEquals({ x: 3, y: 7 })
        expect(vertices[1]).vertexEquals({ x: 3, y: 10 })
        expect(vertices[2]).vertexEquals({ x: 0, y: 10 })
    })

    test('Should be able to translate in the y direction downwards', () => {
        let newModel = sandboxModel.translateY({ dy: -5 })

        let playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)
        let vertices = playerToken.vertices

        expect(vertices[0]).vertexEquals({ x: 3, y: 0 })
        expect(vertices[1]).vertexEquals({ x: 3, y: 3 })
        expect(vertices[2]).vertexEquals({ x: 0, y: 3 })
    })

    test('Triangle vertices should not leave playing field', () => {
        const translateCall = sandboxModel.translateY.bind(sandboxModel, { dy: -50 })
        expect(translateCall).toThrow(new Error('Your triangle has gone out of bounds.'))
    })

    test('Should be able to rotate 90 degrees counterclockwise', () => {
        const newModel = sandboxModel.rotate({ angle: 90 })
        const playerToken = newModel.playerToken

        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)

        let vertices = playerToken.vertices.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }))
        expect(vertices[0]).vertexEquals({ x: -5, y: 3 })
        expect(vertices[1]).vertexEquals({ x: -8, y: 3 })
        expect(vertices[2]).vertexEquals({ x: -8, y: 0 })
    })

    test('Should be able to rotate 180 degrees counterclockwise', () => {
        const newModel = sandboxModel.rotate({ angle: 180 })
        const playerToken = newModel.playerToken

        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)

        let vertices = playerToken.vertices.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }))
        expect(vertices[0]).vertexEquals({ x: -3, y: -5 })
        expect(vertices[1]).vertexEquals({ x: -3, y: -8 })
        expect(vertices[2]).vertexEquals({ x: 0, y: -8 })
    })

    test('Should be able to rotate around given point', () => {
        const point = { x: 3, y: 5 }
        const newModel = sandboxModel.rotate({ angle: 90, point })
        const playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)
        let vertices = playerToken.vertices.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }))

        expect(vertices[0]).vertexEquals({ x: 3, y: 5 })
        expect(vertices[1]).vertexEquals({ x: 0, y: 5 })
        expect(vertices[2]).vertexEquals({ x: 0, y: 2 })
    })

    test('Should be able to reflect about the x-axis', () => {
        const newModel = sandboxModel.reflect({ axis: 'x' })
        const playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)
        let vertices = playerToken.vertices.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }))

        expect(vertices[0]).vertexEquals({ x: 3, y: -5 })
        expect(vertices[1]).vertexEquals({ x: 3, y: -8 })
        expect(vertices[2]).vertexEquals({ x: 0, y: -8 })
    })

    test('Should be able to reflect about the y-axis', () => {
        const newModel = sandboxModel.reflect({ axis: 'y' })
        const playerToken = newModel.playerToken
        expect(playerToken instanceof Polygon).toBe(true)
        expect(playerToken.vertices.length).toBe(3)
        let vertices = playerToken.vertices.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }))

        expect(vertices[0]).vertexEquals({ x: -3, y: 5 })
        expect(vertices[1]).vertexEquals({ x: -3, y: 8 })
        expect(vertices[2]).vertexEquals({ x: 0, y: 8 })
    })

})