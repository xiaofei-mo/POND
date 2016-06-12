import { assert } from 'chai'
import fadeIn from '../../src/utils/fadeIn'
import sinon from 'sinon'

describe('src/utils/fadeIn', () => {
  let func = sinon.spy()
  const duration = 100 // 100ms for a speedy test
  it('calls func 10 times', (done) => {
    fadeIn(func, duration, () => {
      assert.strictEqual(10, func.callCount)
      done()
      func.reset()
    })
  })
})
