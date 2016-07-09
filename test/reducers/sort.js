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

import C from '../../src/constants'
import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import Immutable from 'immutable'
import sortReducer from '../../src/reducers/sort'

chai.use(chaiImmutable)

const STATE_1 = Immutable.Map({
  isOpen: true,
  vocabularies: Immutable.List([
    Immutable.Map({
      isOpen: true,
      name: 'A'
    }),
    Immutable.Map({
      isOpen: false,
      name: 'B'
    })
  ])
})

describe('src/reducers/sort', () => {

  it('returns the initial state with undefined state and no action', () => {
    const state = undefined
    const action = {}
    const actual = sortReducer(state, action)
    const expected = Immutable.Map({
      isOpen: false,
      vocabularies: Immutable.List()
    })
    chai.assert.equal(actual, expected)
  })

  it('returns the passed-in state with no action', () => {
    const state = STATE_1
    const action = {}
    const actual = sortReducer(state, action)
    const expected = STATE_1
    chai.assert.equal(actual, expected)
  })

  it(C.CLOSE_ALL_VOCABULARIES, () => {
    const state = STATE_1
    const action = {
      type: C.CLOSE_ALL_VOCABULARIES
    }
    const actual = sortReducer(state, action)
    const expected = Immutable.Map({
      isOpen: true,
      vocabularies: Immutable.List([
        Immutable.Map({
          isOpen: false,
          name: 'A'
        }),
        Immutable.Map({
          isOpen: false,
          name: 'B'
        })
      ])
    })
    chai.assert.equal(actual, expected)
  })

  it(C.CLOSE_SORT, () => {
    const state = STATE_1
    const action = {
      type: C.CLOSE_SORT
    }
    const actual = sortReducer(state, action)
    const expected = Immutable.Map({
      isOpen: false,
      vocabularies: Immutable.List([
        Immutable.Map({
          isOpen: false,
          name: 'A'
        }),
        Immutable.Map({
          isOpen: false,
          name: 'B'
        })
      ])
    })
    chai.assert.equal(actual, expected)
  })

  it(C.OPEN_SORT, () => {
    const state = undefined
    const action = {
      type: C.OPEN_SORT
    }
    const actual = sortReducer(state, action)
    const expected = Immutable.Map({
      isOpen: true,
      vocabularies: Immutable.List()
    })
    chai.assert.equal(actual, expected)
  })

  it(C.RECEIVED_VOCABULARIES, () => {
    const state = undefined
    const action = {
      type: C.RECEIVED_VOCABULARIES,
      payload: Immutable.Map({
        vocabularies: Immutable.List([
          Immutable.Map({
            isOpen: false,
            name: 'A'
          }),
          Immutable.Map({
            isOpen: false,
            name: 'B'
          })
        ])
      })
    }
    const actual = sortReducer(state, action)
    const expected = Immutable.Map({
      isOpen: false,
      vocabularies: Immutable.List([
        Immutable.Map({
          isOpen: false,
          name: 'A'
        }),
        Immutable.Map({
          isOpen: false,
          name: 'B'
        })
      ])
    })
    chai.assert.equal(actual, expected)
  })

  it(C.TOGGLE_VOCABULARY, () => {
    const state = STATE_1
    const action = {
      type: C.TOGGLE_VOCABULARY,
      payload: Immutable.Map({
        name: 'B'
      })
    }
    const actual = sortReducer(state, action)
    const expected = Immutable.Map({
      isOpen: true,
      vocabularies: Immutable.List([
        Immutable.Map({
          isOpen: false,
          name: 'A'
        }),
        Immutable.Map({
          isOpen: true,
          name: 'B'
        })
      ])
    })
    chai.assert.equal(actual, expected)
  })
})
