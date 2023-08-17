import './assertions'

test('polygon equals helper', () => {
  expect([{ x: 0, y: 5 }, { x: 0, y: 8 }, { x: -3, y: 8 }]).polygonEquals([{ x: 0, y: 5 }, { x: 0, y: 8 }, { x: -3, y: 8 }])
})