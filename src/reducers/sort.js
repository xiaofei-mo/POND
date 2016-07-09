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

import C from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  isOpen: false,
  vocabularies: Immutable.List()
})

export default function sortReducer (state = initialState, action) {
  switch (action.type) {

    case C.CLOSE_ALL_VOCABULARIES:
      return state.set(
        'vocabularies', 
        state.get('vocabularies').map(v => v.set('isOpen', false))
      )

    case C.CLOSE_SORT:
      return state.merge({
        isOpen: false,
        vocabularies: state.get('vocabularies').map(v => v.set('isOpen', false))
      })

    case C.OPEN_SORT:
      return state.set('isOpen', true)

    case C.RECEIVED_VOCABULARIES:
      return state.set('vocabularies', action.payload.get('vocabularies'))
    
    case C.TOGGLE_VOCABULARY:
      return state.set('vocabularies', 
        state.get('vocabularies').map((v) => {
          if (v.get('name') === action.payload.get('name')) {
            return v.set('isOpen', !v.get('isOpen'))
          }
          else {
            return v.set('isOpen', false)
          }
        })
      )

    default:
      return state
  }
}

const _getVocabularyByName = (name) => {
  return state.find((v) => v.name === name)
}
