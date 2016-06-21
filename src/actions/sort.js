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

import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'
import { push } from 'react-router-redux'

export default {

  closeAllVocabularies: () => {
    return {
      type: C.CLOSE_ALL_VOCABULARIES
    }
  },

  closeSort: () => {
    return {
      type: C.CLOSE_SORT
    }
  },

  listenToVocabularies: () => {
    return (dispatch, getState) => {
      dispatch({
        type: C.RECEIVED_VOCABULARIES,
        payload: Immutable.Map({
          vocabularies: Immutable.List([
            Immutable.Map({ 
              isOpen: false,
              name: 'Color', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Rhythm', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Period', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Things', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Forms', 
              terms: Immutable.List([
                Immutable.Map({ name: 'ripple' }), 
                Immutable.Map({ name: 'bubble' }), 
                Immutable.Map({ name: 'meteorite' }), 
                Immutable.Map({ name: 'animals' })
              ])
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Concepts', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Sensory', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Movement', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Perspective', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'Source', 
              terms: Immutable.List()
            }),
            Immutable.Map({ 
              isOpen: false,
              name: 'User', 
              terms: Immutable.List()
            })
          ])
        })
      })
    }
  },

  openSort: () => {
    return {
      type: C.OPEN_SORT
    }
  },

  toggleVocabulary: (name) => {
    return {
      type: C.TOGGLE_VOCABULARY,
      payload: Immutable.Map({
        name: name
      })
    }
  }
  // editItem: (id) => {
  //   return {
  //     type: C.EDIT_ITEM,
  //     payload: Immutable.Map({
  //       id: id
  //     })
  //   }
  // },
  
  // handleScroll: (scrollLeft) => {
  //   return {
  //     type: C.PAGE_SCROLLED,
  //     payload: Immutable.Map({
  //       scrollLeft: scrollLeft
  //     })
  //   }
  // },

  // listenToItems: (timingOrUsername) => {
  //   return (dispatch, getState) => {
  //     const timingSeconds = timingConversion.getSecondsFromString(timingOrUsername)
  //     // const destinationItem = _getDestinationItem(getState, timingSeconds)
  //     // if (!destinationItem.isEmpty()) {
  //     //   dispatch({
  //     //     type: C.RECEIVED_ITEMS, 
  //     //     payload: Immutable.Map({
  //     //       destinationItem: destinationItem,
  //     //       items: getState().getIn(['page', 'items']),
  //     //       timingOrUsername: timingOrUsername
  //     //     })
  //     //   })
  //     //   return
  //     // }
  //     let itemsRef
  //     if (timingSeconds !== undefined) {
  //       _listenToTimingSeconds(timingSeconds, dispatch, timingOrUsername, itemsRef)
  //       return
  //     }
  //     if (timingOrUsername !== undefined) {
  //       _listenToUsername(timingOrUsername, dispatch, timingOrUsername, itemsRef)
  //       return
  //     }
  //     _listenToFeatured(dispatch, timingOrUsername, itemsRef)
  //   }
  // },
}
