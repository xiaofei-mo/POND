import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'

export default {

  listenToItems: (timing) => {
    return (dispatch, getState) => {
      if (_alreadyHaveCenterItem(getState, timing)) {
        dispatch({
          type: C.RECEIVE_ITEMS_AND_TIMING, 
          items: getState().getIn(['page', 'items']),
          timing: timing
        })
      }
      else {
        const ref = new Firebase(C.FIREBASE).child('items')
        let centerRef = ref.orderByChild('isFeatured').equalTo(true)
        if (timing !== undefined) {
          centerRef = ref.orderByChild('timing').equalTo(timing)
        }
        centerRef.on('value', (centerSnapshot) => {
          const centerItem = Immutable.fromJS(centerSnapshot.val())
          ref.orderByChild('user').equalTo(centerItem.first().get('user')).on('value', (snapshot) => {
            const items = Immutable.fromJS(snapshot.val())
            if (items !== null) {
              dispatch({
                type: C.RECEIVE_ITEMS_AND_TIMING, 
                items: items,
                timing: timing
              })
            }
          })
        })
      }
    }
  },

  setMostRecentlyTouched: (id) => {
    return {
      type: C.VIDEO_WAS_TOUCHED, 
      id: id 
    }
  },

  setPageInitiallyScrolledToCenter: () => {
    return {
      type: C.PAGE_INITIALLY_SCROLLED_TO_CENTER
    }    
  },

  setVideoPosition: (id, x, y) => {
    return (dispatch, getState) => {
      const ref = new Firebase(C.FIREBASE).child('items')
      ref.child(id).update({
        x: x,
        y: y
      }, () => {
        dispatch({
          type: C.VIDEO_CHANGED_POSITION,
          id: id,
          x: x,
          y: y
        })
      })
    }
  },

  setVideoReadyToPlay: (id) => {
    return {
      type: C.VIDEO_IS_READY_TO_PLAY, 
      id: id 
    }
  },
  
  setWindowSize(width, height) {
    return {
      type: C.WINDOW_CHANGED_SIZE,
      width: width,
      height: height
    }
  }
}

function _alreadyHaveCenterItem(getState, timing) {
  const centerItems = getState().getIn(['page', 'items']).filter((item) => {
    if(timing === undefined) {
      return item.get('isFeatured')
    }
    return item.get('timing') === timing
  })
  return !centerItems.isEmpty()
}
