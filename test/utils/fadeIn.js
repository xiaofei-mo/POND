import { assert } from 'chai'
import fadeIn from '../../src/utils/fadeIn'
import sinon from 'sinon'

describe('src/utils/fadeIn', () => {
  let func = sinon.spy()
  it('calls func 10 times', (done) => {
    fadeIn(func, () => {
      assert.strictEqual(10, func.callCount)
      done()
      func.reset()
    })
  })
})
