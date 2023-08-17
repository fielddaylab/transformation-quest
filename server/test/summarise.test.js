const app = require('../index')
const { formatBlock } = require('../data-processing/summarizers')

describe('Summarise', () => {

  it('Formats blocks', () => {
    const block = { type: 'cw-rotate-arg', amounts: [21, 4] }
    const formatted = formatBlock(block)
    expect(formatted).toEqual('cw-rotate-arg 21 4 ;')
  })

})
