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
  baseUrl: '',
  destinationItem: Immutable.Map(),
  height: 0,
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

  it(A.PAGE_SCROLLED, () => {
    const state = STATE_2
    const action = {
      type: A.PAGE_SCROLLED,
      payload: Immutable.Map({
        scrollLeft: 1000
      })
    }
    const actual = pageReducer(state, action)
    const expected = STATE_2.set('scrollLeft', 1000)
    chai.assert.equal(actual, expected)
  })

  it(A.RECEIVED_BASE_URL, () => {
    const state = STATE_1
    const action = {
      type: A.RECEIVED_BASE_URL,
      payload: Immutable.Map({
        baseUrl: 'https://mysteriousobjectsatnoon.info/'
      })
    }
    const actual = pageReducer(state, action)
    const expected = Immutable.Map({
      baseUrl: 'https://mysteriousobjectsatnoon.info/',
      destinationItem: Immutable.Map(),
      height: 0,
      items: Immutable.Map(),
      pageId: null,
      width: 0
    })
    chai.assert.equal(actual, expected)
  })

  it(A.RECEIVED_ITEMS, () => {
    const state = STATE_1
    const action = {
      type: A.RECEIVED_ITEMS,
      payload: Immutable.Map({
        destinationItem: Immutable.Map(),
        items: STATE_2.get('items'),
        pageId: 'f7ifK2z7VPTV6fy90VW3dpF2R392'
      })
    }
    const actual = pageReducer(state, action)
    const expected = Immutable.Map({
      baseUrl: '',
      destinationItem: Immutable.Map(),
      height: 0,
      items: STATE_2.get('items'),
      pageId: 'f7ifK2z7VPTV6fy90VW3dpF2R392',
      width: 0
    })
    chai.assert.equal(actual, expected)
  })

  it(A.WINDOW_CHANGED_SIZE, () => {
    const state = STATE_1
    const action = {
      type: A.WINDOW_CHANGED_SIZE,
      payload: Immutable.Map({
        height: 768,
        width: 1024
      })
    }
    const actual = pageReducer(state, action)
    const expected = Immutable.Map({
      baseUrl: '',
      destinationItem: Immutable.Map(),
      height: 768,
      items: Immutable.Map(),
      pageId: null,
      width: 1024
    })
    chai.assert.equal(actual, expected)
  })

})
