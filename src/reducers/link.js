/*/*
 * Copyright (C) 2017 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see 
 * <http://www.gnu.org/licenses/>.
 */

import { A } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  destination: Immutable.Map({
    item: null
  }),
  isInLinkingMode: false,
  isInLinkingTransition: false,
  source: Immutable.Map({
    currentTime: 0,
    item: null,
    left: 0,
    top: 0
  })
})

export default function appReducer (state = initialState, action) {
  switch (action.type) {

    case A.ITEM_CLICKED:
      if (state.get('isInLinkingMode')) {
        // First click is the source item.
        if (state.getIn(['source', 'item']) === null) {
          return state.merge({
            source: Immutable.Map({
              currentTime: action.payload.get('currentTime'),
              item: action.payload.get('item'),
              left: action.payload.get('left'),
              top: action.payload.get('top')
            })
          })
        }
        // Second click is the destination item.
        else {
          return state.merge({
            destination: Immutable.Map({
              item: action.payload.get('item')
            }),
            isInLinkingTransition: true
          })
        }
      }
      return state

    case A.PAGE_CLICKED:
      if (state.get('isInLinkingMode')) {
        return state.merge({
          destination: Immutable.Map({
            item: null
          }),
          isInLinkingMode: false,
          source: Immutable.Map({
            currentTime: 0,
            item: null,
            left: 0,
            top: 0
          })
        })
      }
      return state

    case A.SHOW_METADATA:
      return state.merge({
        destination: Immutable.Map({
          item: null
        }),
        isInLinkingMode: false,
        source: Immutable.Map({
          currentTime: 0,
          item: null,
          left: 0,
          top: 0
        })
      })

    case A.TOGGLE_LINKING_MODE:
      return state.merge({
        destination: Immutable.Map({
          item: null
        }),
        isInLinkingMode: !state.get('isInLinkingMode'),
        source: Immutable.Map({
          currentTime: 0,
          item: null,
          left: 0,
          top: 0
        })
      })

    default:
      return state
  }
}
