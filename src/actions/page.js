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
import firebase from '../utils/firebase'
import Immutable from 'immutable'
import getSecondsFromString from '../utils/getSecondsFromString'
import { push } from 'react-router-redux'

export default {

  createTextItem: (x, y, user, pageId) => {
    return (dispatch, getState) => {
      const ref = firebase.database().ref()
      const lastTimingRef = ref.child('lastTiming')
      lastTimingRef.transaction((lastTiming) => {
        if (lastTiming === null) {
          return 0
        }
        return Math.ceil(lastTiming) + 1
      }).then((lastTimingTransactionRef) => {
        const timing = lastTimingTransactionRef.snapshot.val()
        const itemsRef = ref.child('items')
        const itemRef = itemsRef.push({
          contentState: '',
          height: 300,
          isFeatured: false,
          pageId: pageId,
          timing: timing,
          type: 'text',
          userId: user.get('uid'),
          width: 400,
          x: x,
          y: y
        })
        itemRef.once('value', (itemSnapshot) => {
          itemRef.child('id').set(itemSnapshot.key)
          dispatch({
            type: A.TEXT_ITEM_CREATED, 
            payload: Immutable.Map({
              id: itemSnapshot.key
            })
          })
        })        
      })
    }
  },

  deleteItem: (id) => {
    return (dispatch, getState) => {
      firebase.database().ref().child('items').child(id).remove()
    }
  },
  
  handleScroll: (scrollLeft) => {
    return {
      type: A.PAGE_SCROLLED,
      payload: Immutable.Map({
        scrollLeft: scrollLeft
      })
    }
  },

  listenToItems: (timingOrUsername) => {
    return (dispatch, getState) => {
      const timingSeconds = getSecondsFromString(timingOrUsername)
      if (timingSeconds !== undefined) {
        _listenToTimingSeconds(timingSeconds, dispatch)
        return
      }
      if (timingOrUsername !== undefined) {
        _listenToUsername(timingOrUsername, dispatch)
        return
      }
      _listenToFeatured(dispatch)
    }
  },
  
  setItemPosition: (id, x, y) => {
    return (dispatch, getState) => {
      firebase.database().ref().child('items').child(id).update({
        x: x,
        y: y
      })
    }
  },

  setItemSize: (id, height, width) => {
    return (dispatch, getState) => {
      firebase.database().ref().child('items').child(id).update({
        height: height,
        width: width
      })
    }
  },

  setTextItemRawState: (id, rawState) => {
    return (dispatch, getState) => {
      firebase.database().ref().child('items').child(id).update({
        rawState: rawState
      })
    }
  },
  
  setWindowSize(width, height) {
    return {
      type: A.WINDOW_CHANGED_SIZE,
      payload: Immutable.Map({
        width: width,
        height: height
      })
    }
  }
}

const _listenToFeatured = (dispatch) => {
  const ref = firebase.database().ref()
  const featuredTimingRef = ref.child('featuredTiming')
  featuredTimingRef.once('value', (featuredTimingSnapshot) => {
    const featuredTiming = featuredTimingSnapshot.val()
    let itemsRef = ref.child('items')
    const destinationItemRef = itemsRef.orderByChild('timing').equalTo(featuredTiming)
    destinationItemRef.once('value', (destinationItemSnapshot) => {
      if (destinationItemSnapshot.numChildren() !== 1) {
        // We did not receive any items, so don't do anything. Perhaps we could
        // display a 404 here.
        return
      }
      const destinationItem = destinationItemSnapshot.val()
      const itemId = Object.keys(destinationItem)[0]
      const pageId = destinationItem[itemId]['pageId']
      itemsRef = itemsRef.orderByChild('pageId').equalTo(pageId)
      itemsRef.on('value', (itemsSnapshot) => {
        dispatch({
          type: A.RECEIVED_ITEMS, 
          payload: Immutable.Map({
            destinationItem: Immutable.fromJS(destinationItem[itemId]),
            items: Immutable.fromJS(itemsSnapshot.val()),
            pageId: pageId
          })
        })
      })
    })    
  })
}

const _listenToTimingSeconds = (timingSeconds, dispatch) => {
  const ref = firebase.database().ref()
  let itemsRef = ref.child('items')
  const destinationItemRef = itemsRef.orderByChild('timing').equalTo(timingSeconds)
  destinationItemRef.once('value', (destinationItemSnapshot) => {
    if (destinationItemSnapshot.numChildren() !== 1) {
      dispatch(push('/'))
      return
    }
    const destinationItem = destinationItemSnapshot.val()
    const itemId = Object.keys(destinationItem)[0]
    const pageId = destinationItem[itemId]['pageId']
    itemsRef = itemsRef.orderByChild('pageId').equalTo(pageId)
    itemsRef.on('value', (itemsSnapshot) => {
      dispatch({
        type: A.RECEIVED_ITEMS, 
        payload: Immutable.Map({
          destinationItem: Immutable.fromJS(destinationItem[itemId]),
          items: Immutable.fromJS(itemsSnapshot.val()),
          pageId: pageId
        })
      })
    })
  })
}

const _listenToUsername = (username, dispatch) => {
  const ref = firebase.database().ref()
  // Get username's user ID.
  const usersRef = ref.child('users')
  const userRef = usersRef.orderByChild('username').equalTo(username)
  userRef.once('value', (userSnapshot) => {
    if (userSnapshot.numChildren() !== 1) {
      dispatch(push('/'))
      return
    }
    const pageId = Object.keys(userSnapshot.val())[0]
    const itemsRef = ref.child('items').orderByChild('pageId').equalTo(pageId)
    itemsRef.on('value', (itemsSnapshot) => {
      let items = Immutable.fromJS(itemsSnapshot.val())
      if (items === null) {
        items = Immutable.Map()
      }
      dispatch({
        type: A.RECEIVED_ITEMS, 
        payload: Immutable.Map({
          destinationItem: Immutable.Map(),
          items: items,
          pageId: pageId
        })
      })
    })
  })
}
