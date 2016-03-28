import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map()

export default function usersReducer (state = initialState, action) {
  switch (action.type) {
    case C.RECEIVE_USERS:
      return action.data
    default:
      return state
  }
}
