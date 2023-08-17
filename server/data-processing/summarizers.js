
function formatBlock(block) {
  //TODO: should check block.type from BLOCK_TYPES in blocks.js "enum". shared code?
  if (block.type === 'repeat') return 'repeat ' + block.amounts[0] + ' {' + formatBlocks(block.blockQueue) + '};'
  return block.type + block.amounts.reduce((acc, a) => acc + a + ' ', ' ') + ';'
}

function formatBlocks(blockQueue) {
  return blockQueue.queue.reduce((description, block) => description + formatBlock(block), '')
}

const rewardCount = (rewards, type) => rewards.filter(reward => reward.type === type).length

const padStrings = (delimeter, ...vars) => vars.map(val => (val + '').padStart(2, '0')).join(delimeter)



module.exports = { rewardCount, padStrings, formatBlock, formatBlocks }
