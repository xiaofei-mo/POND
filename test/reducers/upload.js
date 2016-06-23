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
import uploadReducer from '../../src/reducers/upload'

chai.use(chaiImmutable)

describe('src/reducers/upload', () => {

  it('returns the initial state with undefined state and no action', () => {
    const state = undefined
    const action = {}
    const actual = uploadReducer(state, action)
    const expected = Immutable.Map({
      uploads: Immutable.Map()
    })
    chai.assert.equal(actual, expected)
  })

  it('returns the passed-in state with no action', () => {
    const state = Immutable.Map({
      uploads: Immutable.Map({
        '-KHzAnIINJ3s2ExLfFaA': Immutable.Map({
          percent: 100,
          results: Immutable.Map(),
          status: 'done',
          upload: Immutable.Map()
        })
      })
    })
    const action = {}
    const actual = uploadReducer(state, action)
    const expected = state
    chai.assert.equal(actual, expected)
  })

  it(C.RECEIVED_UPLOADS, () => {
    const state = undefined
    const action = {
      type: C.RECEIVED_UPLOADS,
      payload: Immutable.Map({
        uploads: Immutable.Map({
          '-KHzAnIINJ3s2ExLfFaA': Immutable.Map({
            percent: 100,
            results: Immutable.Map(),
            status: 'done',
            upload: Immutable.Map()
          })
        })
      })
    }
    const actual = uploadReducer(state, action)
    const expected = Immutable.Map({
      uploads: Immutable.Map({
        '-KHzAnIINJ3s2ExLfFaA': Immutable.Map({
          percent: 100,
          results: Immutable.Map(),
          status: 'done',
          upload: Immutable.Map()
        })
      })
    })
    chai.assert.equal(actual, expected)
  })

})
