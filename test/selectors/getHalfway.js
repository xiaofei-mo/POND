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

import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import Immutable from 'immutable'
import getHalfway from '../../src/selectors/getHalfway'

chai.use(chaiImmutable)

describe('src/selectors/getHalfway', () => {
  it('returns correct value after scrolling', () => {
    const state = Immutable.Map({
      page: Immutable.Map({
        scrollLeft: 512,
        width: 1024
      })
    })
    chai.assert.strictEqual(getHalfway(state), 1024)
  })
  it('returns correct value before scrolling', () => {
    const state = Immutable.Map({
      page: Immutable.Map({
        scrollLeft: 0,
        width: 1024
      })
    })
    chai.assert.strictEqual(getHalfway(state), 512)
  })
})

