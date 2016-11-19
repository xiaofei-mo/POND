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

import { A } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  vocabularies: Immutable.List([
    Immutable.Map({ 
      isOpen: false,
      name: 'Things', 
      setTerms: Immutable.Set(),
      slug: 'things',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      isOpen: false,
      name: 'Textures', 
      setTerms: Immutable.Set(),
      slug: 'textures',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      isOpen: false,
      name: 'Forms', 
      setTerms: Immutable.Set(),
      slug: 'forms',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      isOpen: false,
      name: 'Movements', 
      setTerms: Immutable.Set(),
      slug: 'movements',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      isOpen: false,
      name: 'Emotions', 
      setTerms: Immutable.Set(),
      slug: 'emotions',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      isOpen: false,
      name: 'Concepts', 
      setTerms: Immutable.Set(),
      slug: 'concepts',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      isOpen: false,
      name: 'Source', 
      setTerms: Immutable.Set(),
      slug: 'source',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      isOpen: false,
      name: 'Other', 
      setTerms: Immutable.Set(),
      slug: 'other',
      terms: Immutable.List()
    })
  ])
})

export default function filterReducer (state = initialState, action) {
  switch (action.type) {

    case A.CLOSE_ALL_VOCABULARIES:
      return state.set(
        'vocabularies', 
        state.get('vocabularies').map(v => v.set('isOpen', false))
      )

    case A.RECEIVED_VOCABULARIES:
      return state.set(
        'vocabularies', 
        state.get('vocabularies').map(v => {
          if (action.payload.get('vocabularies').has(v.get('slug'))) {
            return v.set('terms', action.payload.getIn(['vocabularies', v.get('slug')]))
          }
          return v
        })
      )
    
    case A.TOGGLE_VOCABULARY:
      return state.set(
        'vocabularies', 
        state.get('vocabularies').map(v => {
          // Change to slug?
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
