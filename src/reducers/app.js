import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  authData: null,
  isShowingMetadata: false,
  login: Immutable.Map({
    failed: false,
    isOpen: false
  })
})

export default function appReducer (state = initialState, action) {
  let newState
  switch (action.type) {

    case C.CLOSE_LOGIN:
      return state.setIn(['login', 'isOpen'], false)

    case C.HIDE_METADATA:
      return state.merge({
        isShowingMetadata: false
      })

    case C.LOGIN_FAILED:
      return state.setIn(['login', 'failed'], true)

    case C.OPEN_LOGIN:
      return state.set('login', Immutable.Map({
        isOpen: true,
        failed: false
      }))

    case C.RECEIVED_AUTH_DATA:
      return state.merge({
        authData: action.payload.get('authData'),
        login: state.set('login', Immutable.Map({
          isOpen: false,
          failed: false
        }))
      })

    case C.SHOW_METADATA:
      return state.merge({
        isShowingMetadata: true
      })

    default:
      return state
  }
}
