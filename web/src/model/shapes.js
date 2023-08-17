import { ptInTriangle, triangleRect } from './math'

const roundPoint = ({ x, y }) => ({ x: Math.round(x), y: Math.round(y) })

const transformPoint = (vertex, transform) => roundPoint(transform(vertex))

export const sortVertices = vertices => vertices.slice().sort((a, b) => a.x - b.x || a.y - b.y)

export const pointsEqual = (v1, v2) => v1.x === v2.x && v1.y === v2.y

export class Circle {

    constructor({ x, y }) {
        this.x = x
        this.y = y
    }

    get vertices() { return [{ x: this.x, y: this.y }] }

    transformShape(transform) { return new Circle(transformPoint(this, transform)) }

    assertWithinBounds(axisRange) { axisRange.assertPointInRange(this) }

    doesContain(vertex) { return pointsEqual(this, vertex) }

    matches(circle) { return this.doesContain(circle) }

}

export class Polygon {

    constructor(vertices) {
        this.vertices = vertices
    }

    transformShape(transform) {
        return new Polygon(this.vertices.map(vertex => transformPoint(vertex, transform)))
    }

    assertWithinBounds(axisRange) {
        this.vertices.forEach(vertex => axisRange.assertPointInRange(vertex))
    }

    doesContain(point) {
        if (this.vertices.length !== 3) throw new Error('not supported yet')
        return this.vertices.some(vertex => pointsEqual(vertex, point)) || ptInTriangle(point, this.vertices[0], this.vertices[1], this.vertices[2])
    }

    matches(polygon) {
        const otherVertices = sortVertices(polygon.vertices)
        return sortVertices(this.vertices).every((vertex, i) => pointsEqual(vertex, otherVertices[i]))
    }

    collidesWithRect(rect) {
        return triangleRect(this.vertices, rect)
    }

}