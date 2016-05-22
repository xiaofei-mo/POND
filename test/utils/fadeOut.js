import { assert } from 'chai'
import fadeOut from '../../src/utils/fadeOut'
import sinon from 'sinon'

describe('src/utils/fadeOut', () => {
  let func = sinon.spy()
  it('calls func 10 times', (done) => {
    fadeOut(func, () => {
      assert.strictEqual(10, func.callCount)
      done()
      func.reset()
    })
  })
})
