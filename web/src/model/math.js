
const toRad = degree => (degree * Math.PI) / 180

export function createTranslation({ dx, dy }) {
    return ({ x, y }) => ({ x: x + (dx || 0), y: y + (dy || 0) })
}

export function createRotation({ angle }) {
    const rad = toRad(angle)
    return ({ x, y }) => ({
        x: (x * Math.cos(rad)) - (y * Math.sin(rad)),
        y: (x * Math.sin(rad)) + (y * Math.cos(rad))
    })
}

const getAxisReflection = ({ axis }) => {
    switch (axis) {
        case 'x': return ({ x, y }) => ({ x, y: -y })
        case 'y': return ({ x, y }) => ({ x: -x, y })
        default: return a => a
    }
}

export function createReflection({ axis, point }) {
    const reflect = getAxisReflection({ axis })
    if (!point) return reflect
    return compose(
        createTranslation({ dx: -point.x, dy: -point.y }),
        reflect,
        createTranslation({ dx: point.x, dy: point.y })
    )
}

export function compose(...transformations) {
    return point => transformations.reduce((currentPoint, nextTransformation) => nextTransformation(currentPoint), point)
}

export function createPointRotation({ angle, point }) {
    if (!point) point = { x: 0, y: 0 }
    return compose(
        createTranslation({ dx: -point.x, dy: -point.y }),
        createRotation({ angle }),
        createTranslation({ dx: point.x, dy: point.y })
    )
}

export const centroidOfTriangle = ([v1, v2, v3]) => {
    return { x: (v1.x + v2.x + v3.x) / 3.0, y: (v1.y + v2.y + v3.y) / 3.0 }
}

const centroidOfRect = rect => {
    return { x: rect.x + (rect.width / 2.0), y: rect.y - (rect.height / 2.0) }
}

// http://jsfiddle.net/PerroAZUL/zdaY8/1/
export const ptInTriangle = (p, p0, p1, p2) => {
    var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y)
    var sign = A < 0 ? -1 : 1
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign
    return s >= 0 && t >= 0 && (s + t) <= 2 * A * sign
}

export const pointInRect = ({ x, y }, rect) => {
    return x > rect.x && x < rect.x + rect.width && y < rect.y && y > rect.y - rect.height
}

export const triangleRect = (vertices, rect) => {
    const intersects = vertices.some((point, i) => {
        const next = vertices[(i + 1) % vertices.length];
        return lineRect({ startX: point.x, startY: point.y, endX: next.x, endY: next.y }, rect)
    })
    return intersects
        || pointInRect(centroidOfTriangle(vertices), rect) // Check if triangle in inside the rectangle
        || ptInTriangle(centroidOfRect(rect), vertices[0], vertices[1], vertices[2]) // Check if rectangle in inside the  triangle
}

export const lineRect = (line, { x, y, width, height }) => {
    const leftLine = lineLine(line, { startX: x, startY: y, endX: x, endY: y - height })
    const topLine = lineLine(line, { startX: x, startY: y, endX: x + width, endY: y })
    const rightLine = lineLine(line, { startX: x + width, startY: y, endX: x + width, endY: y - height })
    const bottomLine = lineLine(line, { startX: x, startY: y - height, endX: x + width, endY: y - height })
    return leftLine || topLine || rightLine || bottomLine
}

// Solve for the intersection of 2 line equations
export const lineLine = (line1, line2) => {
    const denominator = ((line2.endY - line2.startY) * (line1.endX - line1.startX) - (line2.endX - line2.startX) * (line1.endY - line1.startY))
    const unknown1 = ((line2.endX - line2.startX) * (line1.startY - line2.startY) - (line2.endY - line2.startY) * (line1.startX - line2.startX)) / denominator
    const unknown2 = ((line1.endX - line1.startX) * (line1.startY - line2.startY) - (line1.endY - line1.startY) * (line1.startX - line2.startX)) / denominator
    return unknown1 > 0 && unknown1 < 1 && unknown2 > 0 && unknown2 < 1
}