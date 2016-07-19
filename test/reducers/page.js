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

import { A } from '../../src/constants'
import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import Immutable from 'immutable'
import pageReducer from '../../src/reducers/page'
import { getPaddingRight, setIsMuted, setUrls } from '../../src/reducers/page'

chai.use(chaiImmutable)

const STATE_1 = Immutable.Map({
  destinationItem: Immutable.Map(),
  height: 0,
  href: '',
  items: Immutable.Map(),
  pageId: null,
  width: 0
})

const STATE_2 = Immutable.fromJS(require('../_resources/pageState.json'))

describe('src/reducers/page', () => {

  it('returns the initial state with undefined state and no action', () => {
    const state = undefined
    const action = {}
    const actual = pageReducer(state, action)
    const expected = STATE_1
    chai.assert.equal(actual, expected)
  })

  it('returns the passed-in state with no action', () => {
    const state = STATE_2
    const action = {}
    const actual = pageReducer(state, action)
    const expected = state
    chai.assert.equal(actual, expected)
  })

})
