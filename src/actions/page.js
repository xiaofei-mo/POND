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
import Firebase from 'firebase'
import Immutable from 'immutable'
import getSecondsFromString from '../utils/getSecondsFromString'
import { push } from 'react-router-redux'

export default {

  createTextItem: (x, y, authData, pageId) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL)
      ref.child('lastTiming').transaction((lastTiming) => {
        if (lastTiming === null) {
          return 0
        }
        return Math.ceil(lastTiming) + + 1
      }).then((timingRef) => {
        const timing = timingRef.snapshot.val()
        const itemsRef = ref.child('items')
        const itemRef = itemsRef.push({
          contentState: '',
          height: 300,
          isFeatured: false,
          pageId: pageId,
          timing: timing,
          type: 'text',
          userId: authData.get('uid'),
          width: 400,
          x: x,
          y: y
        })
        itemRef.once('value', (itemSnapshot) => {
          itemRef.child('id').set(itemSnapshot.key())
          dispatch({
            type: A.TEXT_ITEM_CREATED, 
            payload: Immutable.Map({
              id: itemSnapshot.key()
            })
          })
        })        
      })
    }
  },

  deleteItem: (id) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL).child('items')
      ref.child(id).remove()
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
      let itemsRef
      if (timingSeconds !== undefined) {
        _listenToTimingSeconds(timingSeconds, dispatch, itemsRef)
        return
      }
      if (timingOrUsername !== undefined) {
        _listenToUsername(timingOrUsername, dispatch, itemsRef)
        return
      }
      _listenToFeatured(dispatch, itemsRef)
    }
  },
  
  setItemPosition: (id, x, y) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL).child('items')
      ref.child(id).update({
        x: x,
        y: y
      })
    }
  },

  setItemSize: (id, height, width) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL).child('items')
      ref.child(id).update({
        height: height,
        width: width
      })
    }
  },

  setTextItemRawState: (id, rawState) => {
    return (dispatch, getState) => {
      const ref = new Firebase(config.FIREBASE_URL).child('items')
      ref.child(id).update({
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

const _listenToFeatured = (dispatch, itemsRef) => {
  const ref = new Firebase(config.FIREBASE_URL).child('items')
  const destinationItemRef = ref.orderByChild('isFeatured').equalTo(true)
  destinationItemRef.once('value', (destinationItemSnapshot) => {
    if (destinationItemSnapshot.numChildren() !== 1) {
      // We did not receive any items, so don't do anything. Perhaps we could
      // display a 404 here.
      return
    }
    const destinationItem = destinationItemSnapshot.val()
    const itemId = Object.keys(destinationItem)[0]
    const pageId = destinationItem[itemId]['pageId']
    itemsRef = ref.orderByChild('pageId').equalTo(pageId)
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

const _listenToTimingSeconds = (timingSeconds, dispatch, itemsRef) => {
  const ref = new Firebase(config.FIREBASE_URL).child('items')
  const destinationItemRef = ref.orderByChild('timing').equalTo(timingSeconds)
  destinationItemRef.once('value', (destinationItemSnapshot) => {
    if (destinationItemSnapshot.numChildren() !== 1) {
      dispatch(push('/'))
      return
    }
    const destinationItem = destinationItemSnapshot.val()
    const itemId = Object.keys(destinationItem)[0]
    const pageId = destinationItem[itemId]['pageId']
    itemsRef = ref.orderByChild('pageId').equalTo(pageId)
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

const _listenToUsername = (username, dispatch, itemsRef) => {
  const ref = new Firebase(config.FIREBASE_URL)
  // Get username's user ID.
  const usersRef = ref.child('users')
  const userRef = usersRef.orderByChild('username').equalTo(username)
  userRef.once('value', (userSnapshot) => {
    if (userSnapshot.numChildren() !== 1) {
      dispatch(push('/'))
      return
    }
    const pageId = Object.keys(userSnapshot.val())[0]
    itemsRef = ref.child('items').orderByChild('pageId').equalTo(pageId)
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
