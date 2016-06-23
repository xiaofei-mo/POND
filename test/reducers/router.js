/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

import C from '../../src/constants'
import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import Immutable from 'immutable'
import routerReducer from '../../src/reducers/router'

chai.use(chaiImmutable)

const STATE_1 = Immutable.Map({
  locationBeforeTransitions: Immutable.Map({
    '$searchBase': Immutable.Map({
      search: '',
      searchBase: ''
    }),
    action: 'POP',
    hash: '',
    key: 'nfnnyl',
    pathname: '/',
    query: Immutable.Map(),
    search: '',
    state: null
  })
})

describe('src/reducers/router', () => {

  it('returns the initial state with undefined state and no action', () => {
    const state = undefined
    const action = {}
    const actual = routerReducer(state, action)
    const expected = Immutable.Map({
      locationBeforeTransitions: null
    })
    chai.assert.equal(actual, expected)
  })

  it('returns the passed-in state with no action', () => {
    const state = STATE_1
    const action = {}
    const actual = routerReducer(state, action)
    const expected = state
    chai.assert.equal(actual, expected)
  })

  it(C.LOCATION_CHANGED, () => {
    const state = undefined
    const action = {
      type: C.LOCATION_CHANGED,
      payload: {
        '$searchBase': {
          search: '',
          searchBase: ''
        },
        action: 'POP',
        hash: '',
        key: 'nfnnyl',
        pathname: '/',
        query: {},
        search: '',
        state: null
      }
    }
    const actual = routerReducer(state, action)
    const expected = STATE_1
    chai.assert.equal(actual, expected)
  })

})
