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
import firebase from '../utils/firebase'
import Immutable from 'immutable'
import { push } from 'react-router-redux'

export default {

  itemClicked: (item, left, top, currentTime) => {
    return (dispatch, getState) => {
      const state = getState()
      if (state.getIn(['link', 'source', 'item']) !== null) {
        // If we have a source item, it means that this is a click on the 
        // destination item. So, let's form a link from the source item to the
        // destination item in Firebase.
        const sourceId = state.getIn(['link', 'source', 'item', 'id'])
        const destinationId = item.get('id')
        const sourceRef = firebase.database().ref().child('items')
                          .child(sourceId)
        sourceRef.child('linkedTo').once('value', snapshot => {
          const linkedTo = Immutable.fromJS(snapshot.val())
          if (linkedTo === null || !linkedTo.includes(destinationId)) {
            sourceRef.child('linkedTo').push(destinationId)
          }
        })
        // Start the timer for stage 2 of the linking transition. Stage 2 starts
        // 4 seconds in.
        setTimeout(() => {
          // If the current pathname is not the same as the pathname at the time 
          // the source was clicked, navigate back to the original page. 
          if (state.getIn(['link', 'pathname']) !== 
              state.getIn(['link', 'pathnameAtSourceClickTime'])) {
            dispatch(push(state.getIn(['link', 'pathnameAtSourceClickTime'])))
          }
          dispatch({
            type: A.LINKING_TRANSITION_STAGE_1_FINISHED
          })
        }, 4000)
        // Also, start the timer for completely ending the linking transition 
        // after 7 seconds.
        setTimeout(() => {
          dispatch({
            type: A.LINKING_TRANSITION_FINISHED
          })
        }, 7000)
      }

      dispatch({
        type: A.ITEM_CLICKED,
        payload: Immutable.Map({
          currentTime: currentTime,
          item: item,
          left: left,
          top: top
        })
      })
    }
  },

  planeClicked: () => {
    return {
      type: A.PLANE_CLICKED
    }
  }

}
