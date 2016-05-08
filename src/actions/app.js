import C from 'src/constants'
import Firebase from 'firebase'
import Immutable from 'immutable'

export default {

  attemptLogin: (email, password) => {
    return (dispatch, getState) => {
      const ref = new Firebase(C.FIREBASE)
      ref.authWithPassword({
        email: email,
        password: password
      }, (err, authData) => {
        if (err) {
          dispatch({
            type: C.LOGIN_FAILED
          })
        }
      })
    }
  },

  closeLogin: () => {
    return {
      type: C.CLOSE_LOGIN
    }
  },

  hideInfo: () => {
    return {
      type: C.HIDE_INFO
    }
  },
  
  listenToAuth: () => {
    return (dispatch, getState) => {
      const ref = new Firebase(C.FIREBASE)
      ref.onAuth((authData) => {
        if (authData === null) {
          dispatch({
            type: C.RECEIVED_AUTH_DATA,
            payload: Immutable.Map({
              authData: Immutable.Map()
            })
          })
        }
        else {
          const userRef = ref.child('users').child(authData.uid)
          userRef.once('value', (userSnapshot) => {
            const user = userSnapshot.val()
            authData.username = user.username
            dispatch({
              type: C.RECEIVED_AUTH_DATA,
              payload: Immutable.Map({
                authData: Immutable.fromJS(authData)
              })
            })
          })
        }
      })
    }
  },

  logout: () => {
    return (dispatch, getState) => {
      const ref = new Firebase(C.FIREBASE)
      ref.unauth()
    }
  },

  openLogin: () => {
    return {
      type: C.OPEN_LOGIN
    }
  },

  setBaseUrl: (href) => {
    return {
      type: C.SET_BASE_URL,
      payload: Immutable.Map({
        href: href
      })
    }
  },

  showInfo: () => {
    return {
      type: C.SHOW_INFO
    }    
  }
}
