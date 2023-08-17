import { MEDALS, REWARDS } from "./model/levelModel"
import { Polygon } from "./model/shapes"
import { LoopBlock, BLOCK_TYPES } from "./model/blocks"
import * as Transforms from "./model/math"

const stampGenerator = ({ x, y, hFlip, vFlip }) => {
  const points = []
  if (!hFlip || (hFlip && vFlip)) points.push({ x, y })
  if (!vFlip || (hFlip && vFlip)) points.push({ x: x + 3, y: y - 2 })
  if (hFlip || vFlip) points.push({ x: x + 3, y })
  if (!(hFlip && vFlip)) points.push({ x, y: y - 2 })
  return points
}

export const stampHelper = ({ x, y, hFlip, vFlip, rCount }) => {
  let points = [{ x, y }, { x, y: y - 2 }, { x: x + 3, y: y - 2 }]
  if (hFlip) points = points.map(Transforms.createReflection({ axis: 'y', point: { x, y } }))
  if (vFlip) points = points.map(Transforms.createReflection({ axis: 'x', point: { x, y } }))
  const rt = Transforms.createPointRotation({ angle: '90', point: { x, y } })
  for (let i = 0; i < rCount; i++) points = points.map(rt)
  return points.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }))
}

const reflectionsText = 'Well done!\n\n But be warned, the invaders are growing in number, so you need to use some new skills to avoid them. \n\nThe planet has given you the ability to reflect over large areas.'

const rotationText = 'You have made it halfway to the Queen. Great job fighting off the invaders and building your stockpile of gems. Be careful though, the invaders are catching on to your quest.\n\nNow is the time to use your skill of rotations around the center. These can really spin you around so use them wisely. '

const argumentsText = 'You are almost to the queen!\n\n Now is the time to use all your special skills to deliver the protective gems and save the planet.\n\n You need to save your energy, so think about which one skill requires the least amount of moves...'

export const storyMap = {
  1: 'Watch your step!\n\nYou have encountered the invaders. Move very carefully to avoid being caught while collecting the gems that will help you save the planet.\n\nYou can avoid being captured by translating in horizontal or vertical paths when collecting the gems.',
  2: 'Great job! You made it past the first invaders. You have reached a special area on the planet that will allow you to harness the protective power found at its core at an accelerated speed. \n\nThe purple and yellow triangles are more pure and powerful than the gems. Land directly on these triangular hot spots and collect at least 10 points to strengthen your chances to save the planet.',
  3: reflectionsText, 4: reflectionsText, 5: reflectionsText,
  6: rotationText, 7: rotationText, 8: rotationText,
  9: argumentsText, 10: argumentsText, 11: argumentsText,
}

export const level1 = {
  id: 'alpha-0.1',
  title: 'Horizontal and vertical translations',
  playerToken: new Polygon([{ x: 5, y: 6 }, { x: 8, y: 6 }, { x: 8, y: 8 }]),
  endGoal: new Polygon([{ x: -4, y: -6 }, { x: -1, y: -6 }, { x: -1, y: -4 }]),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.repeat],
  rewards: [
    { type: REWARDS.yellow, x: 1, y: -1 }, { type: REWARDS.yellow, x: 4, y: 3 },
    { type: REWARDS.blue, x: -1, y: -1 }, { type: REWARDS.blue, x: -1, y: 3 }
  ],
  obstacles: [
    { x: -2, y: -2, width: 1, height: 2 },
    { x: -2, y: 2, width: 1, height: 2 },
    { x: -2, y: 6, width: 1, height: 2 }
  ],
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.yellow) >= 2 &&
        levelModel.numberOfGemsCollected(REWARDS.blue) === 0 &&
        levelModel.numberOfInstructionsLessThan(7),
      description: 'Reach the EXIT collecting all yellow gems (using no more than 6 blocks, no blue gems collected)'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 2 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfInstructionsLessThan(5),
      description: 'Reach the EXIT collecting all blue gems (using no more than 4 blocks, no yellow gems collected)'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 2 &&
        levelModel.containsLoop() &&
        levelModel.numberOfInstructionsOutsideOfLoopLessThan(2),
      description: 'Reach the EXIT collecting all blue gems using a loop block (using no more than 1 block outside, no yellow gems collected)'
    }
  ],
}

export const level2 = {
  id: 'alpha-0.2',
  title: '“Creative”- Horizontal and vertical translations',
  description: 'Get at least 10 points with the fewest number of blocks!',
  creative: true,
  playerToken: new Polygon([{ x: -9, y: 3 }, { x: -9, y: 5 }, { x: -6, y: 3 }]),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.repeat],
  stamps: [
    // Quad 1
    { vertices: [{ x: -9, y: 3 }, { x: -9, y: 1 }, { x: -6, y: 1 }], value: 1 },
    { vertices: [{ x: -6, y: 3 }, { x: -6, y: 1 }, { x: -3, y: 1 }], value: 1 },
    { vertices: [{ x: -6, y: 7 }, { x: -6, y: 5 }, { x: -3, y: 5 }], value: 1 },
    { vertices: [{ x: -6, y: 9 }, { x: -6, y: 7 }, { x: -3, y: 7 }], value: 2 },
    { vertices: [{ x: -3, y: 3 }, { x: -3, y: 1 }, { x: -0, y: 1 }], value: 1 },
    { vertices: [{ x: -3, y: 7 }, { x: -3, y: 5 }, { x: -0, y: 5 }], value: 1 },

    // Quad 2
    { vertices: [{ x: 0, y: 3 }, { x: 0, y: 1 }, { x: 3, y: 1 }], value: 2 },
    { vertices: [{ x: 3, y: 3 }, { x: 3, y: 1 }, { x: 6, y: 1 }], value: 1 },
    { vertices: [{ x: 0, y: 7 }, { x: 0, y: 5 }, { x: 3, y: 5 }], value: 1 },
    { vertices: [{ x: 0, y: 9 }, { x: 0, y: 7 }, { x: 3, y: 7 }], value: 2 },
    { vertices: [{ x: 3, y: 7 }, { x: 3, y: 5 }, { x: 6, y: 5 }], value: 1 },
    { vertices: [{ x: 6, y: 7 }, { x: 6, y: 5 }, { x: 9, y: 5 }], value: 1 },
    { vertices: [{ x: 6, y: 9 }, { x: 6, y: 7 }, { x: 9, y: 7 }], value: 2 },

    // Quad 3
    { vertices: [{ x: -6, y: 1 }, { x: -6, y: -1 }, { x: -3, y: -1 }], value: 1 },
    { vertices: [{ x: -6, y: -1 }, { x: -6, y: -3 }, { x: -3, y: -3 }], value: 1 },
    { vertices: [{ x: -9, y: -1 }, { x: -9, y: -3 }, { x: -6, y: -3 }], value: 2 },
    { vertices: [{ x: -9, y: -5 }, { x: -9, y: -7 }, { x: -6, y: -7 }], value: 2 },
    { vertices: [{ x: -6, y: -5 }, { x: -6, y: -7 }, { x: -3, y: -7 }], value: 2 },
    { vertices: [{ x: -3, y: -3 }, { x: -3, y: -5 }, { x: 0, y: -5 }], value: 2 },
    { vertices: [{ x: -3, y: -7 }, { x: -3, y: -9 }, { x: 0, y: -9 }], value: 2 },

    // Quad 4
    { vertices: [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 3, y: -1 }], value: 1 },
    { vertices: [{ x: 0, y: -1 }, { x: 0, y: -3 }, { x: 3, y: -3 }], value: 2 },
    { vertices: [{ x: 3, y: -1 }, { x: 3, y: -3 }, { x: 6, y: -3 }], value: 1 },
    { vertices: [{ x: 3, y: -3 }, { x: 3, y: -5 }, { x: 6, y: -5 }], value: 2 },
    { vertices: [{ x: 6, y: -3 }, { x: 6, y: -5 }, { x: 9, y: -5 }], value: 2 },
    { vertices: [{ x: 3, y: -5 }, { x: 3, y: -7 }, { x: 6, y: -7 }], value: 1 },
    { vertices: [{ x: 6, y: -7 }, { x: 6, y: -9 }, { x: 9, y: -9 }], value: 2 },
  ],
  obstacles: [
    { x: -9, y: 7, width: 3, height: 2 },
    { x: -3, y: 5, width: 3, height: 2 },
    { x: 3, y: 5, width: 3, height: 2 },
    { x: 6, y: 3, width: 3, height: 6 },
    { x: -9, y: -3, width: 3, height: 2 },
    { x: -9, y: -7, width: 3, height: 2 },
    { x: -3, y: -1, width: 3, height: 2 },
    { x: -3, y: -5, width: 3, height: 2 },
    { x: 0, y: -5, width: 3, height: 4 },
    { x: 6, y: -5, width: 3, height: 2 },
  ],
  winCondition: model => model.getStampScore() >= 10,
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(11),
      description: 'Using at most 10 blocks'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(9),
      description: 'Using at most 8 blocks'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(7),
      description: 'Using at most 6 blocks'
    }
  ],
}

export const level3 = {
  id: 'alpha-0.3',
  title: 'Reflections over X-axis',
  playerToken: new Polygon([{ x: -9, y: 6 }, { x: -9, y: 4 }, { x: -6, y: 4 }]),
  endGoal: new Polygon([{ x: 6, y: -4 }, { x: 6, y: -6 }, { x: 9, y: -4 }]),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.xReflect, BLOCK_TYPES.repeat],
  rewards: [
    { type: REWARDS.yellow, x: -2, y: 4 }, { type: REWARDS.yellow, x: 3, y: 4 },
    { type: REWARDS.blue, x: -2, y: 8 }, { type: REWARDS.blue, x: 3, y: 8 },
    { type: REWARDS.yellow, x: -7, y: -4 }, { type: REWARDS.yellow, x: -2, y: -4 },
    { type: REWARDS.blue, x: -7, y: -8 }, { type: REWARDS.blue, x: -2, y: -8 },
    { type: REWARDS.yellow, x: 3, y: -4 }, { type: REWARDS.blue, x: 3, y: -8 },
  ],
  obstacles: [
    { x: -5, y: 10, width: 1, height: 11 },
    { x: 0, y: 1, width: 1, height: 11 },
  ],
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 0 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) >= 5 &&
        levelModel.numberOfInstructionsLessThan(7),
      description: 'Reach the EXIT collecting all yellow gems (using no more than 6 blocks, no blue gems collected)'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 5 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfInstructionsLessThan(11),
      description: 'Reach the EXIT collecting all blue gems (using no more than 10 blocks, no yellow gems collected)'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 5 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.containsLoop() &&
        levelModel.numberOfInstructionsOutsideOfLoopLessThan(5),
      description: 'Reach the EXIT collecting all blue gems using a loop block (using no more than 4 blocks outside, no yellow gems collected)'
    }
  ],
}


export const level4 = {
  id: 'beta-0.4',
  title: 'Reflections over Y-axis',
  playerToken: new Polygon(stampHelper({ x: -8, y: 7 })),
  endGoal: new Polygon(stampHelper({ x: 8, y: -8, hFlip: true })),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.yReflect, BLOCK_TYPES.repeat],
  rewards: [
    { type: REWARDS.blue, x: -7, y: 1 }, { type: REWARDS.blue, x: -7, y: -4 },
    { type: REWARDS.blue, x: 7, y: 1 }, { type: REWARDS.blue, x: 7, y: -4 },
    { type: REWARDS.yellow, x: -3, y: 1 }, { type: REWARDS.yellow, x: -3, y: -4 },
    { type: REWARDS.yellow, x: 3, y: 1 }, { type: REWARDS.yellow, x: 3, y: -4 },
    { type: REWARDS.blue, x: 7, y: 6 }, { type: REWARDS.yellow, x: 3, y: 6 },
  ],
  obstacles: [
    { x: -9, y: 5, width: 8, height: 2 },
  ],
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel =>
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 5
        && levelModel.numberOfGemsCollected(REWARDS.blue) === 0
        && levelModel.numberOfInstructionsLessThan(8),
      description: 'Reach the EXIT collecting all yellow gems (using no more than 7 blocks, no blue gems collected)'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel =>
        levelModel.numberOfGemsCollected(REWARDS.blue) === 5
        && levelModel.numberOfGemsCollected(REWARDS.yellow) === 0
        && levelModel.numberOfInstructionsLessThan(7),
      description: 'Reach the EXIT collecting blue gems (using no more than 6 blocks, no yellow gems collected)'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel =>
        levelModel.numberOfGemsCollected(REWARDS.blue) === 5
        && levelModel.numberOfGemsCollected(REWARDS.yellow) === 0
        && levelModel.rootMatches([LoopBlock]),
      description: 'Reach the EXIT collecting all blue gems using a loop block (using no blocks outside, no yellow gems collected)'
    }
  ],
}

export const level5 = {
  id: 'alpha-0.5',
  title: '“Creative”- Reflections and translations',
  description: 'Get at least 10 points with the fewest number of blocks!',
  creative: true,
  playerToken: new Polygon(stampGenerator({ x: -3, y: -6 })),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.xReflect, BLOCK_TYPES.yReflect, BLOCK_TYPES.repeat, BLOCK_TYPES.xReflectArg, BLOCK_TYPES.yReflectArg],
  stamps: [
    // Quad 1
    { vertices: stampGenerator({ x: -6, y: 10, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: -3, y: 10 }), value: 2 },
    { vertices: stampGenerator({ x: -3, y: 8, vFlip: true }), value: 1 },
    { vertices: stampGenerator({ x: -6, y: 8, hFlip: true }), value: 1 },
    { vertices: stampGenerator({ x: -3, y: 6 }), value: 2 },
    { vertices: stampGenerator({ x: -3, y: 4, vFlip: true }), value: 1 },
    { vertices: stampGenerator({ x: -6, y: 4, hFlip: true }), value: 1 },
    { vertices: stampGenerator({ x: -6, y: 2, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: -3, y: 2 }), value: 1 },
    { vertices: stampGenerator({ x: -10, y: 2, hFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: -7, y: 2 }), value: 2 },

    // Quad 2
    { vertices: stampGenerator({ x: 0, y: 6, hFlip: true, vFlip: false }), value: 1 },
    { vertices: stampGenerator({ x: 0, y: 4, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: 0, y: 2, hFlip: true, vFlip: false }), value: 2 },
    { vertices: stampGenerator({ x: 4, y: 8, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: 4, y: 4, hFlip: false, vFlip: false }), value: 1 },
    { vertices: stampGenerator({ x: 4, y: 2, hFlip: true, vFlip: false }), value: 2 },
    { vertices: stampGenerator({ x: 7, y: 2, hFlip: false, vFlip: false }), value: 2 },

    // Quad 3
    { vertices: stampGenerator({ x: -10, y: 0, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: -7, y: 0, hFlip: false, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: -6, y: 0, hFlip: true, vFlip: false }), value: 1 },
    { vertices: stampGenerator({ x: -3, y: 0, hFlip: false, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: -3, y: -2, hFlip: false, vFlip: false }), value: 2 },
    { vertices: stampGenerator({ x: -3, y: -4, hFlip: false, vFlip: true }), value: 1 },
    { vertices: stampGenerator({ x: -6, y: -4, hFlip: true, vFlip: false }), value: 1 },
    { vertices: stampGenerator({ x: -6, y: -6, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: -6, y: -8, hFlip: true, vFlip: false }), value: 1 },
    { vertices: stampGenerator({ x: -3, y: -8, hFlip: false, vFlip: true }), value: 1 },

    // Quad 4
    { vertices: stampGenerator({ x: 0, y: 0, hFlip: true, vFlip: true }), value: 1 },
    { vertices: stampGenerator({ x: 0, y: -2, hFlip: true, vFlip: false }), value: 1 },
    { vertices: stampGenerator({ x: 0, y: -4, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: 0, y: -6, hFlip: true, vFlip: false }), value: 1 },
    { vertices: stampGenerator({ x: 4, y: -6, hFlip: true, vFlip: false }), value: 2 },
    { vertices: stampGenerator({ x: 4, y: -2, hFlip: false, vFlip: true }), value: 1 },
    { vertices: stampGenerator({ x: 4, y: 0, hFlip: true, vFlip: true }), value: 2 },
    { vertices: stampGenerator({ x: 7, y: 0, hFlip: false, vFlip: true }), value: 2 },
  ],
  obstacles: [
    { x: -6, y: 6, width: 3, height: 2 },
    { x: -6, y: -2, width: 3, height: 2 },
    { x: 0, y: 8, width: 3, height: 2 },
    { x: -10, y: 2, width: 1, height: 1 },
    { x: -10, y: -1, width: 1, height: 1 },
    { x: 4, y: 2, width: 1, height: 1 },
    { x: 4, y: -1, width: 1, height: 1 },
  ],
  winCondition: model => model.getStampScore() >= 10,
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(11),
      description: 'Using at most 10 blocks'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(9),
      description: 'Using at most 8 blocks'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(7),
      description: 'Using at most 6 blocks'
    }
  ],
}

export const level6 = {
  id: 'beta-0.6',
  title: 'Rotations over the origin',
  playerToken: new Polygon(stampHelper({ x: -2, y: -3, rCount: 1 })),
  endGoal: new Polygon(stampHelper({ x: 6, y: -7 })),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.cwRotate, BLOCK_TYPES.ccwRotate, BLOCK_TYPES.repeat],
  obstacles: [
    { x: -10, y: 5, width: 8, height: 2 },
    { x: -10, y: -3, width: 8, height: 2 },
    { x: -5, y: -7, width: 2, height: 2 },
    { x: -5, y: -7, width: 2, height: 2 },
    { x: 3, y: -3, width: 2, height: 2 }, { x: 3, y: -7, width: 2, height: 2 }, { x: 7, y: -3, width: 2, height: 2 },
    { x: 3, y: 5, width: 2, height: 2 }, { x: 3, y: 9, width: 2, height: 2 }, { x: 7, y: 5, width: 2, height: 2 },
  ],
  rewards: [
    { type: REWARDS.blue, x: -5, y: 0 }, { type: REWARDS.blue, x: 0, y: 5 }, { type: REWARDS.blue, x: 0, y: -5 }, { type: REWARDS.blue, x: 5, y: 0 },
    { type: REWARDS.blue, x: -7, y: 8 }, { type: REWARDS.blue, x: -8, y: -7 },
    { type: REWARDS.yellow, x: -2, y: 1 }, { type: REWARDS.yellow, x: 1, y: 2 }, { type: REWARDS.yellow, x: 2, y: -1 },
    { type: REWARDS.yellow, x: 0, y: -8 }, { type: REWARDS.yellow, x: 9, y: 0 },
  ],
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel =>
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 5
        && levelModel.numberOfGemsCollected(REWARDS.blue) === 0
        && levelModel.numberOfInstructionsLessThan(9),
      description: 'Reach the EXIT collecting all yellow gems (using no more than 8 blocks, no blue gems collected)'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel =>
        levelModel.numberOfGemsCollected(REWARDS.blue) === 6
        && levelModel.numberOfGemsCollected(REWARDS.yellow) === 0
        && levelModel.numberOfInstructionsLessThan(10),
      description: 'Reach the EXIT collecting all blue gems (using no more than 9 blocks, no yellow gems collected)'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel =>
        ((levelModel.numberOfGemsCollected(REWARDS.blue) === 6 &&
          levelModel.numberOfGemsCollected(REWARDS.yellow) === 0) &&
          levelModel.containsLoop() &&
          levelModel.numberOfInstructionsOutsideOfLoopLessThan(7)),
      description: 'Reach the EXIT collecting all blue gems using a loop block (no more than 6 blocks outside, no yellow gems collected)'
    }
  ]
}

export const level7 = {
  id: 'alpha-0.4',
  title: 'Rotations over the origin',
  playerToken: new Polygon([{ x: 0, y: 10 }, { x: 0, y: 8 }, { x: 3, y: 8 }]),
  endGoal: new Polygon([{ x: 2, y: 8 }, { x: 2, y: 6 }, { x: 5, y: 6 }]),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.cwRotate, BLOCK_TYPES.ccwRotate, BLOCK_TYPES.repeat],
  rewards: [
    { type: REWARDS.blue, x: -9, y: 5 }, { type: REWARDS.blue, x: -9, y: 3 },
    { type: REWARDS.yellow, x: -9, y: 1 }, { type: REWARDS.yellow, x: -7, y: 3 },

    { type: REWARDS.blue, x: -5, y: -7 }, { type: REWARDS.blue, x: -5, y: -9 },
    { type: REWARDS.yellow, x: -1, y: -9 },

    { type: REWARDS.blue, x: 7, y: -3 }, { type: REWARDS.blue, x: 7, y: -5 },
    { type: REWARDS.yellow, x: 9, y: -1 }
  ],
  obstacles: [
    { x: 1, y: 8, width: 1, height: 2 },
    { x: 5, y: 8, width: 1, height: 2 },
    { x: 1, y: 6, width: 5, height: 1 },

    { x: -1, y: 2, width: 3, height: 3 },
    { x: 1, y: -1, width: 1, height: 9 },

    { x: -9, y: 10, width: 1, height: 1 },
    { x: -8, y: 9, width: 1, height: 1 },
    { x: -7, y: 8, width: 1, height: 1 },
    { x: -6, y: 7, width: 1, height: 1 },
    { x: -5, y: 6, width: 1, height: 1 },
    { x: -4, y: 5, width: 1, height: 1 },
    { x: -3, y: 4, width: 1, height: 1 },
    { x: -2, y: 3, width: 1, height: 1 },
  ],
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.yellow) >= 4 &&
        levelModel.numberOfGemsCollected(REWARDS.blue) === 0 &&
        levelModel.numberOfInstructionsLessThan(7),
      description: 'Reach the EXIT collecting all yellow gems (using no more than 6 blocks, no blue gems collected)'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 6 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfInstructionsLessThan(9),
      description: 'Reach the EXIT collecting all blue gems (using no more than 8 blocks, no yellow gems collected)'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 6 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfRootInstructionsOfType(LoopBlock) === 1 &&
        levelModel.numberOfInstructionsOutsideOfLoopLessThan(3),
      description: 'Reach the EXIT collecting only blue gems using a loop block (using only 2 blocks outside, no yellow gems collected)'
    }
  ],
}

export const level8 = {
  id: 'beta-0.8',
  title: '“Creative”- Rotations, reflections, and translations',
  description: 'Get at least 10 points with the fewest number of blocks!',
  creative: true,
  playerToken: new Polygon(stampHelper({ x: 0, y: 10 })),
  obstacles: [
    { x: -4, y: 4, width: 2, height: 2 },
    { x: -7, y: 9, width: 2, height: 2 },
    { x: 2, y: 4, width: 2, height: 2 },
    { x: -9, y: -3, width: 2, height: 2 },
    { x: -4, y: -2, width: 2, height: 2 },
  ],
  stamps: [
    // Quad 1
    { vertices: stampHelper({ x: -10, y: 3, rCount: 1 }), value: 1 },
    { vertices: stampHelper({ x: -5, y: 2 }), value: 1 },
    { vertices: stampHelper({ x: 0, y: 3, rCount: 2 }), value: 1 },
    { vertices: stampHelper({ x: -7, y: 3, rCount: 1 }), value: 2 },
    { vertices: stampHelper({ x: -7, y: 0, rCount: 1 }), value: 2 },
    { vertices: stampHelper({ x: -2, y: 5, rCount: 1 }), value: 2 },
    { vertices: stampHelper({ x: -2, y: 0, rCount: 1 }), value: 2 },

    // Quad 2
    { vertices: stampHelper({ x: 3, y: 10 }), value: 1 },
    { vertices: stampHelper({ x: 0, y: 7 }), value: 1 },
    { vertices: stampHelper({ x: 2, y: 5, rCount: 3 }), value: 1 },
    { vertices: stampHelper({ x: 0, y: 2 }), value: 2 },
    { vertices: stampHelper({ x: 3, y: 0, rCount: 1 }), value: 1 },
    { vertices: stampHelper({ x: 5, y: 2 }), value: 2 },

    { vertices: stampHelper({ x: 7, y: 5 }), value: 2 },
    { vertices: stampHelper({ x: 7, y: 5, rCount: 1 }), value: 1 },
    { vertices: stampHelper({ x: 7, y: 5, rCount: 2 }), value: 2 },
    { vertices: stampHelper({ x: 7, y: 5, rCount: 3 }), value: 1 },

    // Quad 3
    { vertices: stampHelper({ x: -5, y: -2, rCount: 2 }), value: 1 },
    { vertices: stampHelper({ x: -3, y: 0, rCount: 3 }), value: 2 },
    { vertices: stampHelper({ x: 0, y: -2, rCount: 2 }), value: 2 },
    { vertices: stampHelper({ x: -2, y: -5, rCount: 1 }), value: 1 },
    { vertices: stampHelper({ x: 0, y: -7, rCount: 2 }), value: 2 },
    { vertices: stampHelper({ x: -3, y: -7, rCount: 2 }), value: 1 },
    { vertices: stampHelper({ x: -9, y: -7, rCount: 0 }), value: 1 },
    { vertices: stampHelper({ x: -6, y: -9, rCount: 2 }), value: 2 },

    // Quad 4
    { vertices: stampHelper({ x: 2, y: 0, rCount: 3 }), value: 1 },
    { vertices: stampHelper({ x: 0, y: -3 }), value: 1 },
    { vertices: stampHelper({ x: 2, y: -5, rCount: 3 }), value: 2 },
    { vertices: stampHelper({ x: 5, y: -2, rCount: 2 }), value: 2 },
    { vertices: stampHelper({ x: 7, y: 0, rCount: 3 }), value: 1 },
    { vertices: stampHelper({ x: 10, y: 0, rCount: 3 }), value: 2 },

    { vertices: stampHelper({ x: 7, y: -7 }), value: 2 },
    { vertices: stampHelper({ x: 7, y: -7, rCount: 1 }), value: 1 },
    { vertices: stampHelper({ x: 7, y: -7, rCount: 2 }), value: 2 },
    { vertices: stampHelper({ x: 7, y: -7, rCount: 3 }), value: 1 },

  ],
  winCondition: model => model.getStampScore() >= 10,
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(11),
      description: 'Using at most 10 blocks'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(9),
      description: 'Using at most 8 blocks'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(7),
      description: 'Using at most 6 blocks'
    }
  ]
}

export const level9 = {
  id: 'beta-0.9',
  title: 'Rotations over any point (x,y) as center',
  playerToken: new Polygon([{ x: -5, y: 8 }, { x: -7, y: 8 }, { x: -7, y: 5 }]),
  endGoal: new Polygon([{ x: -6, y: -7 }, { x: -8, y: -7 }, { x: -8, y: -10 }]),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.cwRotate, BLOCK_TYPES.ccwRotate, BLOCK_TYPES.cwRotateArg, BLOCK_TYPES.ccwRotateArg, BLOCK_TYPES.repeat],
  rewards: [
    { type: REWARDS.blue, x: -9, y: 6 }, { type: REWARDS.blue, x: -8, y: 3 },
    { type: REWARDS.blue, x: -5, y: 4 },

    { type: REWARDS.blue, x: 5, y: 6 }, { type: REWARDS.blue, x: 8, y: 7 },
    { type: REWARDS.blue, x: 6, y: 3 }, { type: REWARDS.blue, x: 9, y: 4 },

    { type: REWARDS.yellow, x: -2, y: 1 }, { type: REWARDS.yellow, x: 1, y: 2 },
    { type: REWARDS.yellow, x: 2, y: -1 }, { type: REWARDS.yellow, x: -1, y: -2 },
    { type: REWARDS.yellow, x: 1, y: -8 }
  ],
  obstacles: [
    { x: -9, y: 9, width: 2, height: 2 },
    { x: -5, y: 7, width: 2, height: 2 },

    { x: -6, y: 3, width: 2, height: 2 },
    { x: -2, y: 4, width: 2, height: 2 },

    { x: -10, y: 1, width: 2, height: 2 },
    { x: -4, y: 0, width: 2, height: 2 },
    { x: -3, y: -3, width: 2, height: 2 },
    { x: 0, y: -2, width: 2, height: 2 },
    { x: 3, y: 5, width: 2, height: 2 },
    { x: 8, y: 3, width: 2, height: 2 },
    { x: 5, y: 9, width: 2, height: 2 }
  ],
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.yellow) >= 5 &&
        levelModel.numberOfGemsCollected(REWARDS.blue) === 0 &&
        levelModel.numberOfInstructionsLessThan(9),
      description: 'Reach the EXIT collecting all yellow gems (using no more than 8 blocks, no blue gems collected)'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 7 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfInstructionsLessThan(11),
      description: 'Reach the EXIT collecting all blue gems (using no more than 10 blocks, no yellow gems collected)'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 7 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfRootInstructionsOfType(LoopBlock) >= 1 &&
        levelModel.numberOfInstructionsOutsideOfLoopLessThan(4),
      description: 'Reach the EXIT collecting all blue gems using at least 1 loop block (using no more than 3 blocks outside, no yellow gems collected)'
    }
  ]
}

export const level10 = {
  id: 'beta-0.10',
  title: 'Reflection over any horizontal or vertical lines',
  playerToken: new Polygon([{ x: -1, y: -7 }, { x: 1, y: -7 }, { x: -1, y: -10 }]),
  endGoal: new Polygon([{ x: 8, y: -1 }, { x: 10, y: 2 }, { x: 10, y: -1 }]),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.xReflect, BLOCK_TYPES.yReflect, BLOCK_TYPES.xReflectArg, BLOCK_TYPES.yReflectArg, BLOCK_TYPES.repeat],
  rewards: [
    { type: REWARDS.blue, x: -5, y: 8 }, { type: REWARDS.blue, x: 0, y: 8 },
    { type: REWARDS.blue, x: 5, y: 8 },

    { type: REWARDS.blue, x: 5, y: 3 }, { type: REWARDS.blue, x: 5, y: -2 },
    { type: REWARDS.yellow, x: 8, y: -4 }, { type: REWARDS.yellow, x: 8, y: -8 },
    { type: REWARDS.blue, x: 0, y: -2 }, { type: REWARDS.blue, x: -5, y: -2 },
    { type: REWARDS.blue, x: -5, y: 3 },
    { type: REWARDS.yellow, x: 8, y: 6 }, { type: REWARDS.yellow, x: 8, y: 1 },
    { type: REWARDS.yellow, x: -8, y: -9 },
    { type: REWARDS.yellow, x: -8, y: -4 }, { type: REWARDS.yellow, x: -8, y: 1 },
    { type: REWARDS.yellow, x: -8, y: 6 },
  ],
  obstacles: [
    { x: -3, y: 6, width: 6, height: 6 },

    { x: 7, y: 5, width: 2, height: 2 },
    { x: 8, y: -5, width: 2, height: 2 },

    { x: 5, y: -5, width: 2, height: 2 },
    { x: 2, y: -5, width: 2, height: 2 },
    { x: -1, y: -5, width: 2, height: 2 },
    { x: -4, y: -5, width: 2, height: 2 },
    { x: -7, y: -5, width: 2, height: 2 },
    { x: -10, y: -5, width: 2, height: 2 },
    { x: -9, y: 0, width: 2, height: 2 },
    { x: -9, y: 5, width: 2, height: 2 },
    { x: -9, y: 10, width: 2, height: 2 },
  ],
  medalCriteria: [
    {
      medal: MEDALS.bronze,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.yellow) >= 8 &&
        levelModel.numberOfGemsCollected(REWARDS.blue) === 0 &&
        levelModel.numberOfInstructionsLessThan(11),
      description: 'Reach the EXIT collecting all yellow gems (using no more than 10 blocks, no blue gems collected)'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 8 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfInstructionsLessThan(11),
      description: 'Reach the EXIT collecting all blue gems (using no more than 10 blocks, no yellow gems collected)'
    },
    {
      medal: MEDALS.gold,
      attained: levelModel => levelModel.numberOfGemsCollected(REWARDS.blue) >= 8 &&
        levelModel.numberOfGemsCollected(REWARDS.yellow) === 0 &&
        levelModel.numberOfRootInstructionsOfType(LoopBlock) === 1 &&
        levelModel.numberOfInstructionsOutsideOfLoopLessThan(7),
      description: 'Reach the EXIT collecting all blue gems using a loop block (using no more than 6 blocks outside, no yellow gems collected)'
    }
  ]
}

export const level11 = {
  id: 'beta-0.11',
  title: '“Creative”- All transformations',
  description: 'Get at least 10 points with the fewest number of blocks!',
  creative: true,
  playerToken: new Polygon([{ x: 7, y: 1 }, { x: 7, y: 3 }, { x: 4, y: 3 }]),
  availableBlocks: [BLOCK_TYPES.xTranslate, BLOCK_TYPES.yTranslate, BLOCK_TYPES.cwRotate, BLOCK_TYPES.ccwRotate, BLOCK_TYPES.cwRotateArg, BLOCK_TYPES.ccwRotateArg, BLOCK_TYPES.xReflect, BLOCK_TYPES.yReflect, BLOCK_TYPES.xReflectArg, BLOCK_TYPES.yReflectArg, BLOCK_TYPES.repeat],
  stamps: [
    // Quad 1
    { vertices: stampHelper({ x: 0, y: 9, hFlip: true, vFlip: false, rCount: 0 }), value: 2 },
    { vertices: stampHelper({ x: 0, y: 5, hFlip: true, vFlip: true, rCount: 0 }), value: 1 },
    { vertices: [{ x: -3, y: 7 }, { x: -6, y: 7 }, { x: -6, y: 9 }], value: 2 },
    { vertices: stampHelper({ x: -6, y: 9, hFlip: true, vFlip: false, rCount: 0 }), value: 2 },
    { vertices: stampHelper({ x: -6, y: 5, hFlip: false, vFlip: true, rCount: 0 }), value: 1 },
    { vertices: stampHelper({ x: -1, y: 3, hFlip: false, vFlip: false, rCount: 2 }), value: 2 },
    { vertices: [{ x: -10, y: 4 }, { x: -10, y: 1 }, { x: -8, y: 4 }], value: 2 },
    { vertices: [{ x: -7, y: 3 }, { x: -4, y: 3 }, { x: -7, y: 1 }], value: 1 },
    { vertices: [{ x: -4, y: 2 }, { x: -2, y: 2 }, { x: -2, y: -1 }], value: 1 },

    // Quad 2
    { vertices: [{ x: 10, y: 1 }, { x: 10, y: 4 }, { x: 8, y: 4 }], value: 2 },
    { vertices: [{ x: 1, y: 5 }, { x: 1, y: 3 }, { x: 4, y: 5 }], value: 2 },
    { vertices: [{ x: 2, y: 2 }, { x: 4, y: 2 }, { x: 2, y: -1 }], value: 1 },
    { vertices: [{ x: 0, y: 9 }, { x: 0, y: 7 }, { x: 3, y: 7 }], value: 2 },
    { vertices: [{ x: 3, y: 7 }, { x: 6, y: 7 }, { x: 6, y: 9 }], value: 2 },
    { vertices: [{ x: 6, y: 7 }, { x: 6, y: 9 }, { x: 9, y: 7 }], value: 2 },
    { vertices: [{ x: 0, y: 7 }, { x: 3, y: 7 }, { x: 0, y: 5 }], value: 1 },
    { vertices: [{ x: 3, y: 7 }, { x: 6, y: 5 }, { x: 6, y: 7 }], value: 1 },
    { vertices: [{ x: 6, y: 7 }, { x: 6, y: 5 }, { x: 9, y: 7 }], value: 1 },

    // Quad 3
    { vertices: [{ x: -8, y: 1 }, { x: -8, y: -2 }, { x: -6, y: -2 }], value: 1 },
    { vertices: [{ x: -3, y: -1 }, { x: -3, y: -3 }, { x: -6, y: -3 }], value: 1 },
    { vertices: [{ x: -9, y: -3 }, { x: -6, y: -5 }, { x: -9, y: -5 }], value: 2 },
    { vertices: [{ x: 0, y: -1 }, { x: 0, y: -4 }, { x: -2, y: -4 }], value: 2 },
    { vertices: stampHelper({ x: 0, y: -7, hFlip: false, vFlip: false, rCount: 3 }), value: 1 },
    { vertices: stampHelper({ x: -4, y: -7, hFlip: true, vFlip: false, rCount: 1 }), value: 2 },
    { vertices: stampHelper({ x: -4, y: -7, hFlip: false, vFlip: false, rCount: 3 }), value: 1 },
    { vertices: stampHelper({ x: -8, y: -7, hFlip: true, vFlip: false, rCount: 1 }), value: 2 },
    { vertices: stampHelper({ x: -8, y: -7, hFlip: false, vFlip: false, rCount: 3 }), value: 1 },

    // Quad 4
    { vertices: [{ x: 0, y: -1 }, { x: 0, y: -4 }, { x: 2, y: -4 }], value: 2 },
    { vertices: [{ x: 3, y: -1 }, { x: 3, y: -3 }, { x: 6, y: -3 }], value: 1 },
    { vertices: [{ x: 6, y: -2 }, { x: 8, y: -2 }, { x: 8, y: 1 }], value: 1 },
    { vertices: stampHelper({ x: 9, y: -3, hFlip: true, vFlip: false, rCount: 0 }), value: 2 },
    { vertices: stampHelper({ x: -6, y: 5, hFlip: true, vFlip: true, rCount: 0 }), value: 1 },
    { vertices: stampHelper({ x: 8, y: -7, hFlip: true, vFlip: false, rCount: 1 }), value: 2 },
    { vertices: stampHelper({ x: 8, y: -7, hFlip: false, vFlip: false, rCount: 3 }), value: 1 },
    { vertices: stampHelper({ x: 4, y: -7, hFlip: true, vFlip: false, rCount: 1 }), value: 2 },
    { vertices: stampHelper({ x: 4, y: -7, hFlip: false, vFlip: false, rCount: 3 }), value: 1 },
    { vertices: stampHelper({ x: 0, y: -7, hFlip: true, vFlip: false, rCount: 1 }), value: 2 },

  ],
  winCondition: model => model.getStampScore() >= 10,
  medalCriteria: [
    {
      medal: MEDALS.bronze, attained:
        levelModel => levelModel.numberOfInstructionsLessThan(11),
      description: 'Using at most 10 blocks'
    },
    {
      medal: MEDALS.silver,
      attained: levelModel => levelModel.numberOfInstructionsLessThan(9),
      description: 'Using at most 8 blocks'
    },
    {
      medal: MEDALS.gold, attained:
        levelModel => levelModel.numberOfInstructionsLessThan(7),
      description: 'Using at most 6 blocks'
    }
  ]
}
