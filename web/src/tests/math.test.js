import * as Transforms from '../model/math'
import { lineLine, lineRect, triangleRect } from '../model/math'
import './assertions'
import { Polygon } from '../model/shapes'

describe('Math', () => {

    describe('collision', () => {

        describe('lines', () => {

            it('Should collide 2 lines', () => {
                expect(lineLine({ startX: 0, startY: 0, endX: 10, endY: 10 }, { startX: 0, startY: 4, endX: 7, endY: 4 })).toBeTruthy()
            })
            it('Should not collide 2 parallel lines', () => {
                expect(lineLine({ startX: 0, startY: 0, endX: 10, endY: 10 }, { startX: -2, startY: 0, endX: 8, endY: 10 })).toBeFalsy()
            })
            it('Should not collide lines that will eventually intersect', () => {
                expect(lineLine({ startX: 0, startY: 0, endX: 1, endY: 1 }, { startX: 0, startY: 5, endX: 1, endY: 5 })).toBeFalsy()
            })
            it('Should not collide lines that are only touching', () => {
                expect(lineLine({ startX: 0, startY: 0, endX: 5, endY: 5 }, { startX: 5, startY: 5, endX: 10, endY: 10 })).toBeFalsy()
            })
            it('Should not collide perpendicular lines that are only touching', () => {
                expect(lineLine({ startX: 0, startY: 0, endX: 10, endY: 0 }, { startX: 5, startY: 0, endX: 5, endY: 10 })).toBeFalsy()
            })
            it('Should not collide lines that are equivelent', () => {
                expect(lineLine({ startX: 0, startY: 0, endX: 10, endY: 10 }, { startX: 0, startY: 0, endX: 10, endY: 10 })).toBeFalsy()
            })

        })

        describe('triangleRect', () => {

            const t = new Polygon([{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 5 }])
            const t2 = new Polygon([{ x: -2, y: 4 }, { x: 1, y: 4 }, { x: 1, y: 6 }])
            const rect = { x: -2, y: 6, height: 2, width: 1 }

            it('Should collide a triangle with rectangle', () => {
                expect(triangleRect(t.vertices, { x: 2, y: 4, width: 2, height: 2 })).toBeTruthy()
            })
            it('Should collide a triangle inside a rectangle', () => {
                expect(triangleRect(t.vertices, { x: -10, y: 10, width: 20, height: 20 })).toBeTruthy()
            })
            it('Should collide a rectangle inside a triangle ', () => {
                expect(triangleRect(t.vertices, { x: 1, y: 2, width: 1, height: 1 })).toBeTruthy()
            })
            it('Should not collide a triangle with a distant rectangle  ', () => {
                expect(triangleRect(t.vertices, { x: 8, y: 8, width: 1, height: 1 })).toBeFalsy()
            })
            it('Should not collide a triangle with a rectangle touching it', () => {
                expect(triangleRect(t.vertices, { x: -1, y: 5, width: 1, height: 5 })).toBeFalsy()
            })

            it('Should collide with specific winding angle', () => {
                expect(triangleRect(t2.vertices, rect)).toBeTruthy()
            })

        })

        describe('line to rectangle', () => {

            it('Should collide a line with rectangle', () => {
                expect(lineRect({ startX: 0, startY: 0, endX: 10, endY: 10 }, { x: 2, y: 3, width: 2, height: 2 })).toBeTruthy()
            })

            it('Should not collide a line with rectangle', () => {
                expect(lineRect({ startX: 0, startY: 0, endX: 2, endY: 4 }, { x: 2, y: 3, width: 2, height: 2 })).toBeFalsy()
            })

            it('Should not collide a line above rectangle', () => {
                expect(lineRect({ startX: 0, startY: 4, endX: 10, endY: 4 }, { x: 2, y: 3, width: 2, height: 2 })).toBeFalsy()
            })
        })

    })

    describe('Transformations', () => {


        describe('Translations', () => {

            it('should make a translation', () => {
                let translate = Transforms.createTranslation({ dx: 1, dy: 4 })
                let newPoint = translate({ x: 10, y: 20 })
                expect(newPoint.x).toBe(11)
                expect(newPoint.y).toBe(24)
            })

        })

        describe('Rotations', () => {

            it('should make a rotation', () => {
                let rotation = Transforms.createRotation({ angle: 90 })
                let newPoint = rotation({ x: 10, y: 20 })
                expect(Math.round(newPoint.x)).toBe(-20)
                expect(Math.round(newPoint.y)).toBe(10)
            })

        })

        describe('Reflections', () => {

            it('should make a reflection about the x-axis', () => {
                let reflection = Transforms.createReflection({ axis: 'x' })
                let newPoint = reflection({ x: 10, y: 20 })
                expect(Math.round(newPoint.x)).toBe(10)
                expect(Math.round(newPoint.y)).toBe(-20)
            })

            it('should make a reflection about the x-axis of a point', () => {
                let reflection = Transforms.createReflection({ axis: 'x', point: { x: 0, y: 3 } })
                let newPoint = reflection({ x: 0, y: 2 })
                expect(Math.round(newPoint.x)).toBe(0)
                expect(Math.round(newPoint.y)).toBe(4)
            })

            it('should make a reflection about the y-axis', () => {
                let reflection = Transforms.createReflection({ axis: 'y' })
                let newPoint = reflection({ x: 10, y: 20 })
                expect(Math.round(newPoint.x)).toBe(-10)
                expect(Math.round(newPoint.y)).toBe(20)
            })

            it('should make a reflection about the y-axis of a point', () => {
                let reflection = Transforms.createReflection({ axis: 'y', point: { x: 3, y: 0 } })
                let newPoint = reflection({ x: 2, y: 0 })
                expect(Math.round(newPoint.x)).toBe(4)
                expect(Math.round(newPoint.y)).toBe(0)
            })

        })

        describe('Composing', () => {

            it('should compose transformations', () => {
                let translate1 = Transforms.createTranslation({ dx: 1, dy: 4 })
                let translate2 = Transforms.createTranslation({ dx: -2, dy: 7 })
                let composed = Transforms.compose(translate1, translate2)
                let newPoint = composed({ x: 10, y: 20 })
                expect(newPoint.x).toBe(9)
                expect(newPoint.y).toBe(31)
            })

            it('should compose transformations in order', () => {
                let translate = Transforms.createTranslation({ dx: 1, dy: 4 })
                let rotate = Transforms.createRotation({ angle: 90 })
                let composed = Transforms.compose(translate, rotate)
                let newPoint = composed({ x: 10, y: 20 })
                expect(Math.round(newPoint.x)).toBe(-24)
                expect(Math.round(newPoint.y)).toBe(11)
            })

            it('should compose more than two transformations in order', () => {
                let translate1 = Transforms.createTranslation({ dx: 1, dy: 4 })
                let rotate = Transforms.createRotation({ angle: 90 })
                let translate2 = Transforms.createTranslation({ dx: -2, dy: -7 })
                let composed = Transforms.compose(translate1, rotate, translate2)
                let newPoint = composed({ x: 10, y: 20 })
                expect(Math.round(newPoint.x)).toBe(-26)
                expect(Math.round(newPoint.y)).toBe(4)
            })

        })
    })

})