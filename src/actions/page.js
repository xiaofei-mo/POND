import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'

export default {
  listenToItems: (timing) => {
    return (dispatch, getState) => {
      const existingCenterItem = _getExistingCenterItem(getState, timing)
      if (!existingCenterItem.isEmpty()) {
        dispatch({
          type: C.RECEIVE_CENTER_ITEM,
          centerItem: existingCenterItem
        })
      }
      else {
        let ref = new Firebase(C.FIREBASE).child('items')
        let centerRef = ref.orderByChild('isFeatured').equalTo(true)
        if (timing !== undefined) {
          centerRef = ref.orderByChild('timing').equalTo(timing)
        }
        centerRef.on('value', (centerSnapshot) => {
          const centerItem = Immutable.fromJS(centerSnapshot.val())
          dispatch({
            type: C.RECEIVE_CENTER_ITEM,
            centerItem: centerItem
          })
          ref.orderByChild('user').equalTo(centerItem.first().get('user')).on('value', (snapshot) => {
            const items = Immutable.fromJS(snapshot.val())
            if (items !== null) {
              dispatch({
                type: C.RECEIVE_ITEMS, 
                items: items
              })
            }
          })
        })
      }
    }
  },
  setPageInitiallyScrolledToCenter: () => {
    return {
      type: C.PAGE_INITIALLY_SCROLLED_TO_CENTER
    }    
  },
  setVideoPosition: (id, x, y) => {
    let ref = new Firebase(C.FIREBASE).child('items').child(id)
    ref.update({
      x: x,
      y: y
    })
    return {
      type: C.VIDEO_CHANGED_POSITION,
      id: id,
      x: x,
      y: x
    }
  },
  setVideoReadyToPlay: (id) => {
    return {
      type: C.VIDEO_IS_READY_TO_PLAY, 
      id: id 
    }
  }
}

function _getExistingCenterItem(getState, timing) {
  const entry = getState().getIn(['page', 'items']).findEntry(item => item.get('timing') === timing)
  if (entry === undefined) {
    return Immutable.Map()
  }
  const id = entry[0]
  return Immutable.Map({
    id: entry[1]
  })
}
