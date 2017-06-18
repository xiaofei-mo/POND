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
import getSecondsFromString from '../../src/utils/getSecondsFromString'

describe('src/utils/getSecondsFromString', () => {
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
  it('handles 1:1:01:01:01', () => {
    assert.strictEqual(undefined, getSecondsFromString('1:1:01:01:01'))
  })
  it('handles null', () => {
    assert.strictEqual(undefined, getSecondsFromString(null))
  })
  it('handles undefined', () => {
    assert.strictEqual(undefined, getSecondsFromString(undefined))
  })
})
