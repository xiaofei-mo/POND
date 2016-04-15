import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'
import timingConversion from 'src/utils/timingConversion'
import { push } from 'react-router-redux'

export default {

  listenToItems: (timing) => {
    const timingSeconds = timingConversion.getSecondsFromString(timing)
    return (dispatch, getState) => {
      if (_alreadyHaveCenterItem(getState, timingSeconds)) {
        dispatch({
          type: C.RECEIVE_ITEMS_AND_TIMING, 
          payload: Immutable.Map({
            items: getState().getIn(['page', 'items']),
            timing: timingSeconds
          })
        })
      }
      else {
        const ref = new Firebase(C.FIREBASE).child('items')
        let centerRef = ref.orderByChild('isFeatured').equalTo(true)
        if (timingSeconds !== undefined) {
          centerRef = ref.orderByChild('timing').equalTo(timingSeconds)
        }
        centerRef.on('value', (centerSnapshot) => {
          const centerItem = Immutable.fromJS(centerSnapshot.val())
          if(centerItem === null) {
            // Equivalent to 404
            dispatch(push('/'))
            return
          }
          const userId = centerItem.first().get('userId')
          const itemsRef = ref.orderByChild('userId').equalTo(userId)
          itemsRef.on('value', (itemsSnapshot) => {
            const items = Immutable.fromJS(itemsSnapshot.val())
            dispatch({
              type: C.RECEIVED_ITEMS_AND_TIMING, 
              payload: Immutable.Map({
                items: items,
                timing: timingSeconds
              })
            })
          })
        })
      }
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

  setPageInitiallyScrolledToCenter: () => {
    return {
      type: C.PAGE_INITIALLY_SCROLLED_TO_CENTER
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

function _alreadyHaveCenterItem(getState, timingSeconds) {
  const centerItems = getState().getIn(['page', 'items']).filter((item) => {
    if(timing === undefined) {
      return item.get('isFeatured')
    }
    return item.get('timing') === timingSeconds
  })
  return !centerItems.isEmpty()
}
