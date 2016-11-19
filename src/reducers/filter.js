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
import queryString from 'query-string'

const initialState = Immutable.Map({
  vocabularies: Immutable.List([
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Things', 
      slug: 'things',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Textures', 
      slug: 'textures',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Forms', 
      slug: 'forms',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Movements', 
      slug: 'movements',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Emotions', 
      slug: 'emotions',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Concepts', 
      slug: 'concepts',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Source', 
      slug: 'source',
      terms: Immutable.List()
    }),
    Immutable.Map({ 
      applied: Immutable.Set(),
      isOpen: false,
      name: 'Other', 
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

    case A.LOCATION_CHANGED:
      const search = action.payload.hash.replace(/#/, '')
      const appliedFilters = Immutable.fromJS(queryString.parse(search))
      return state.set(
        'vocabularies',
        state.get('vocabularies').map(v => {
          appliedFilters.forEach((afs, slug) => {
            if (slug === v.get('slug')) {
              if (!Immutable.List.isList(afs)) {
                v = v.set('applied', v.get('applied').add(afs))
              }
              else {
                v = v.set('applied', v.get('applied').union(afs))
              }
            }
          })
          return v
        })
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
