import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'

export default {
  startListeningToItems: () => {
    return (dispatch, getState) => {
      let ref = new Firebase(C.FIREBASE).child('items')
      ref.on('value', (snapshot) => {
        const data = Immutable.fromJS(snapshot.val())
        if (data !== null) {
          dispatch({
            type: C.RECEIVE_ITEMS, 
            data: data
          })
        }
      })
    }
  },
  setVideoReadyToPlay: (id) => {
    return {
      type: C.VIDEO_IS_READY_TO_PLAY, 
      id: id 
    }
  }
}
