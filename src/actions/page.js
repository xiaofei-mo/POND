import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'

function getExistingCenterItem(getState, timing) {
  const entry = getState().getIn(['page', 'items']).findEntry(item => item.get('timing') === timing)
  if (entry === undefined) {
    return Immutable.Map()
  }
  const id = entry[0]
  return Immutable.Map({
    id: entry[1]
  })
}

export default {
 setVideoReadyToPlay: (id) => {
    return {
      type: C.VIDEO_IS_READY_TO_PLAY, 
      id: id 
    }
  },
  listenToItems: (timing) => {
    return (dispatch, getState) => {
      const existingCenterItem = getExistingCenterItem(getState, timing)
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
          ref.orderByChild('user').equalTo(centerItem.first().get('user')).on('value', (snapshot) => {
            const items = Immutable.fromJS(snapshot.val())
            if (items !== null) {
              dispatch({
                type: C.RECEIVE_ITEMS, 
                items: items
              })
              dispatch({
                type: C.RECEIVE_CENTER_ITEM,
                centerItem: centerItem
              })
            }
          })
        })
      }
    }
  }
}
