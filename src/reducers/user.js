import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map()

export default function userReducer (state = initialState, action) {
  switch (action.type) {
    case C.RECEIVE_USERS:
      return action.payload.get('users')
    default:
      return state
  }
}
