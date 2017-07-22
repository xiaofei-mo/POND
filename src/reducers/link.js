/*
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
    currentTime: 0,
    item: null,
    left: 0,
    top: 0
  }),
  isInLinkingMode: false,
  isInLinkingTransition: false,
  isInLinkingTransitionStage2: false,
  pathnameAtSourceClickTime: null,
  source: Immutable.Map({
    currentTime: 0,
    item: null,
    left: 0,
    top: 0
  }),
  linkStills: null,
})

export default function appReducer(state = initialState, action) {
  switch (action.type) {

    case A.ITEM_CLICKED:
      if (state.get('isInLinkingMode')) {
        // First click is the source item.
        if (state.getIn(['source', 'item']) === null) {
          return state.merge({
            // Make a note of the pathname at this point. This is so we can 
            // navigate back here at the conclusion of the linking process if 
            // the user ends up using filters to go to a new pathname.
            pathnameAtSourceClickTime: state.get('pathname'),
            source: Immutable.Map({
              currentTime: action.payload.get('currentTime'),
              item: action.payload.get('item'),
              left: action.payload.get('left'),
              top: action.payload.get('top')
            })
          })
        }
        // Second click is the destination item. (The Firebase stuff is done in 
        // link actions, along with setting the timer to end the linking 
        // transition.
        else {
          return state.merge({
            destination: Immutable.Map({
              currentTime: action.payload.get('currentTime'),
              item: action.payload.get('item'),
              left: action.payload.get('left'),
              top: action.payload.get('top')
            }),
            isInLinkingTransition: true
          })
        }
      }
      return state

    case A.LINKING_TRANSITION_FINISHED:
      return state.merge(initialState)

    case A.LINKING_TRANSITION_STAGE_1_FINISHED:
      return state.set('isInLinkingTransitionStage2', true)

    case A.LOCATION_CHANGED:
      return state.set('pathname', action.payload.pathname)

    case A.PAGE_CLICKED:
      if (state.get('isInLinkingMode')) {
        return state.merge(initialState)
      }
      return state

    case A.PLANE_CLICKED:
      return state.merge({
        destination: Immutable.Map({
          item: null
        }),
        isInLinkingMode: !state.get('isInLinkingMode'),
        isInLinkingTransition: false,
        pathnameAtSourceClickTime: null,
        source: Immutable.Map({
          currentTime: 0,
          item: null,
          left: 0,
          top: 0
        })
      })

    case A.SHOW_METADATA:
      return state.merge(initialState)

    case A.REQUEST_STILLS:
      return state.set('linkStills', null)

    case A.STILLS_PREPARED:
      return state.set('linkStills', action.payload)

    default:
      return state
  }
}
