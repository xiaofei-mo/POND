/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see <http://www.gnu.org/licenses/>.
 */

import { assert } from 'chai'
import getStringFromSeconds from '../../src/utils/getStringFromSeconds'

describe('src/utils/getStringFromSeconds', () => {
  it('converts integer 1', () => {
    assert.strictEqual('0:00:00:01', getStringFromSeconds(1))
  })
  it('converts string 1', () => {
    assert.strictEqual('0:00:00:01', getStringFromSeconds('1'))
  })
  it('converts integer 61', () => {
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
