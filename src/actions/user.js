import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'

export default {
  startListeningToUsers: () => {
    return (dispatch, getState) => {
      let ref = new Firebase(C.FIREBASE).child('users')
      ref.on('value', (snapshot) => {
        dispatch({
          type: C.RECEIVE_USERS, 
          users: Immutable.fromJS(snapshot.val())
        })
      })
    }
  }
}
