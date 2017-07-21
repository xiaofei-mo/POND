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
  baseUrl: '',
  destinationItem: Immutable.Map(),
  featuredItemId: null,
  height: 0,
  items: Immutable.Map(),
  pageId: null,
  scrollLeft: 0,
  stateOnLinkSourceClick: null,
  width: 0
})

export default function pageReducer(state = initialState, action) {
  switch (action.type) {

    case A.ITEM_CLICKED:
      // If this is a click on a source item,
      if (state.get('stateOnLinkSourceClick') === null) {
        // take a snapshot of the current state and store it for redisplay at
        // the end of the linking transition.
        const stateOnLinkSourceClick = state.delete('stateOnLinkSourceClick')
          .delete('items') // Do not take snapshots of items
        // We need to get the newest state of links

        return state.set('stateOnLinkSourceClick', stateOnLinkSourceClick)
      }
      return state

    case A.LINKING_TRANSITION_STAGE_1_FINISHED:
      if (state.get('stateOnLinkSourceClick') !== null) {
        const restoredState = state.merge(state.get('stateOnLinkSourceClick')
          .set('stateOnLinkSourceClick', null))
        return restoredState
      }
      return state

    case A.PAGE_SCROLLED:
      return state.set('scrollLeft', action.payload.get('scrollLeft'))

    case A.RECEIVED_BASE_URL:
      return state.set('baseUrl', action.payload.get('baseUrl'))

    case A.RECEIVED_FEATURED_ITEM_ID:
      return state.set('featuredItemId', action.payload.get('featuredItemId'))

    case A.RECEIVED_ITEMS:
      return state.merge({
        destinationItem: action.payload.get('destinationItem'),
        items: action.payload.get('items'),
        pageId: action.payload.get('pageId')
      })

    case A.TEXT_ITEM_CREATED:
      return state.set('items', state.get('items').map((item, id) => {
        if (item.get('id') === id) {
          return item.set('isFocused', true)
        }
        else {
          return item.set('isFocused', false)
        }
      }))

    case A.WINDOW_CHANGED_SIZE:
      return state.merge({
        height: action.payload.get('height'),
        width: action.payload.get('width')
      })

    default:
      return state
  }
}
