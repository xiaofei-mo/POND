import { assert } from 'chai'
import timingConversion from '../../src/utils/timingConversion'

const getSecondsFromString = timingConversion.getSecondsFromString
const getStringFromSeconds = timingConversion.getStringFromSeconds

describe('src/utils/timingConversion getSecondsFromString', () => {
  it('converts 0:00:00:00', () => {
    assert.strictEqual(0, getSecondsFromString('0:00:00:00'))
  })
  it('converts 0:00:00:01', () => {
    assert.strictEqual(1, getSecondsFromString('0:00:00:01'))
  })
  it('converts 0:00:01:01', () => {
    assert.strictEqual(61, getSecondsFromString('0:00:01:01'))
  })
  it('converts 0:01:01:01', () => {
    assert.strictEqual(3661, getSecondsFromString('0:01:01:01'))
  })
  it('converts 1:01:01:01', () => {
    assert.strictEqual(90061, getSecondsFromString('1:01:01:01'))
  })
  it('handles 0:-10:00:01', () => {
    assert.strictEqual(undefined, getSecondsFromString('0:-10:00:01'))
  })
  it('handles 0:0.25:00:00', () => {
    assert.strictEqual(undefined, getSecondsFromString('0:0.25:00:00'))
  })
  it('handles 0:Infinity:00:01', () => {
    assert.strictEqual(undefined, getSecondsFromString('0:Infinity:00:00'))
  })
  it('handles 0:null:00:01', () => {
    assert.strictEqual(undefined, getSecondsFromString('0:null:00:00'))
  })
  it('handles a:bc:de:fg', () => {
    assert.strictEqual(undefined, getSecondsFromString('a:bc:de:fg'))
  })
  it('handles null', () => {
    assert.strictEqual(undefined, getSecondsFromString(null))
  })
  it('handles undefined', () => {
    assert.strictEqual(undefined, getSecondsFromString(undefined))
  })
})

describe('src/utils/timingConversion getStringFromSeconds', () => {
  it('converts integer 1', () => {
    assert.strictEqual('0:00:00:01', getStringFromSeconds(1))
  })
  it('converts string 1', () => {
    assert.strictEqual('0:00:00:01', getStringFromSeconds('1'))
  })
  it('converts intger 61', () => {
    assert.strictEqual('0:00:01:01', getStringFromSeconds(61))
  })
  it('converts string 61', () => {
    assert.strictEqual('0:00:01:01', getStringFromSeconds('61'))
  })
  it('converts integer 3661', () => {
    assert.strictEqual('0:01:01:01', getStringFromSeconds(3661))
  })
  it('converts string 3661', () => {
    assert.strictEqual('0:01:01:01', getStringFromSeconds('3661'))
  })
  it('converts integer 90061', () => {
    assert.strictEqual('1:01:01:01', getStringFromSeconds(90061))
  })
  it('converts string 90061', () => {
    assert.strictEqual('1:01:01:01', getStringFromSeconds('90061'))
  })
  it('handles -61', () => {
    assert.strictEqual(undefined, getStringFromSeconds(-61))
  })
  it('handles 60.25', () => {
    assert.strictEqual(undefined, getStringFromSeconds(60.25))
  })
  it('handles NaN', () => {
    assert.strictEqual(undefined, getStringFromSeconds(NaN))
  })
  it('handles Infinity', () => {
    assert.strictEqual(undefined, getStringFromSeconds(Infinity))
  })
  it('handles null', () => {
    assert.strictEqual(undefined, getStringFromSeconds(null))
  })
  it('handles undefined', () => {
    assert.strictEqual(undefined, getStringFromSeconds(undefined))
  })
})
