import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'
import timingConversion from 'src/utils/timingConversion'
import { push } from 'react-router-redux'

const _listenToTimingSeconds = (timingSeconds, dispatch, timingOrUsername, itemsRef) => {
  const ref = new Firebase(C.FIREBASE).child('items')
  const destinationItemRef = ref.orderByChild('timing').equalTo(timingSeconds)
  destinationItemRef.once('value', (destinationItemSnapshot) => {
    if (destinationItemSnapshot.numChildren() !== 1) {
      dispatch(push('/'))
      return
    }
    const destinationItem = destinationItemSnapshot.val()
    const itemId = Object.keys(destinationItem)[0]
    const userId = destinationItem[itemId]['userId']
    itemsRef = ref.orderByChild('userId').equalTo(userId)
    itemsRef.on('value', (itemsSnapshot) => {
      dispatch({
        type: C.RECEIVED_ITEMS, 
        payload: Immutable.Map({
          destinationItem: Immutable.fromJS(destinationItem[itemId]),
          items: Immutable.fromJS(itemsSnapshot.val()),
          timingOrUsername: timingOrUsername
        })
      })
    })
  })
}

const _listenToUsername = (username, dispatch, timingOrUsername, itemsRef) => {
  const ref = new Firebase(C.FIREBASE)
  // Get username's user ID.
  const usersRef = ref.child('users')
  const userRef = usersRef.orderByChild('username').equalTo(username)
  userRef.once('value', (userSnapshot) => {
    if (userSnapshot.numChildren() !== 1) {
      dispatch(push('/'))
      return
    }
    const userId = Object.keys(userSnapshot.val())[0]
    itemsRef = ref.child('items').orderByChild('userId').equalTo(userId)
    itemsRef.on('value', (itemsSnapshot) => {
      dispatch({
        type: C.RECEIVED_ITEMS, 
        payload: Immutable.Map({
          destinationItem: undefined,
          items: Immutable.fromJS(itemsSnapshot.val()),
          timingOrUsername: timingOrUsername
        })
      })
    })
  })
}

const _listenToFeatured = (dispatch, timingOrUsername, itemsRef) => {
  const ref = new Firebase(C.FIREBASE).child('items')
  const destinationItemRef = ref.orderByChild('isFeatured').equalTo(true)
  destinationItemRef.once('value', (destinationItemSnapshot) => {
    if (destinationItemSnapshot.numChildren() !== 1) {
      // We did not receive any items, so don't do anything. Perhaps we could
      // display a 404 here.
      return
    }
    const destinationItem = destinationItemSnapshot.val()
    const itemId = Object.keys(destinationItem)[0]
    const userId = destinationItem[itemId]['userId']
    itemsRef = ref.orderByChild('userId').equalTo(userId)
    itemsRef.on('value', (itemsSnapshot) => {
      dispatch({
        type: C.RECEIVED_ITEMS, 
        payload: Immutable.Map({
          destinationItem: Immutable.fromJS(destinationItem[itemId]),
          items: Immutable.fromJS(itemsSnapshot.val()),
          timingOrUsername: timingOrUsername
        })
      })
    })
  })
}

// const _getDestinationItem = (getState, timingSeconds) => {
//   const destinationItem = getState().getIn(['page', 'items']).filter((item) => {
//     if(timingSeconds === undefined) {
//       return item.get('isFeatured')
//     }
//     return item.get('timing') === timingSeconds
//   })
//   if (!destinationItem.isEmpty()) {
//     return destinationItem.first()
//   }
//   return destinationItem
// }

export default {

  editItem: (id) => {
    return {
      type: C.EDIT_ITEM,
      payload: Immutable.Map({
        id: id
      })
    }
  },
  
  handleScroll: (scrollLeft) => {
    return {
      type: C.PAGE_SCROLLED,
      payload: Immutable.Map({
        scrollLeft: scrollLeft
      })
    }
  },

  listenToItems: (timingOrUsername) => {
    return (dispatch, getState) => {
      const timingSeconds = timingConversion.getSecondsFromString(timingOrUsername)
      // const destinationItem = _getDestinationItem(getState, timingSeconds)
      // if (!destinationItem.isEmpty()) {
      //   dispatch({
      //     type: C.RECEIVED_ITEMS, 
      //     payload: Immutable.Map({
      //       destinationItem: destinationItem,
      //       items: getState().getIn(['page', 'items']),
      //       timingOrUsername: timingOrUsername
      //     })
      //   })
      //   return
      // }
      let itemsRef
      if (timingSeconds !== undefined) {
        _listenToTimingSeconds(timingSeconds, dispatch, timingOrUsername, itemsRef)
        return
      }
      if (timingOrUsername !== undefined) {
        _listenToUsername(timingOrUsername, dispatch, timingOrUsername, itemsRef)
        return
      }
      _listenToFeatured(dispatch, timingOrUsername, itemsRef)
    }
  },

  setMostRecentlyTouched: (id) => {
    return {
      type: C.ITEM_WAS_TOUCHED, 
      payload: Immutable.Map({
        id: id
      })
    }
  },

  setPageInitiallyScrolled: () => {
    return {
      type: C.PAGE_INITIALLY_SCROLLED
    }
  },

  setItemPosition: (id, x, y) => {
    return (dispatch, getState) => {
      const ref = new Firebase(C.FIREBASE).child('items')
      ref.child(id).update({
        x: x,
        y: y
      })
    }
  },

  setVideoReadyToPlay: (id) => {
    return {
      type: C.VIDEO_IS_READY_TO_PLAY, 
      payload: Immutable.Map({
        id: id
      })
    }
  },
  
  setWindowSize(width, height) {
    return {
      type: C.WINDOW_CHANGED_SIZE,
      payload: Immutable.Map({
        width: width,
        height: height
      })
    }
  }
}
