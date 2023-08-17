

const formatVertex = (vertex) => '(' + vertex.x + ',' + vertex.y + ')'

const formatPolygon = (vertices) => vertices.reduce((stringSoFar, vertex, index) => stringSoFar + (index > 0 ? ',' : '') + formatVertex(vertex), '')

expect.extend({
    vertexEquals(received, value) {
        return {
            message: () => `expected ${formatVertex(received)} to triple equal ${formatVertex(value)} `,
            pass: received.x === value.x && received.y === value.y
        }
    },
    polygonEquals(received, value) {
        return {
            message: () => `expected ${formatPolygon(received)} to triple equal ${formatPolygon(value)} `,
            pass: received.length === value.length
                && received[0].x === value[0].x && received[0].y === value[0].y
                && received[1].x === value[1].x && received[1].y === value[1].y
                && received[2].x === value[2].x && received[2].y === value[2].y
        }
    }
})

