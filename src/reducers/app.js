import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  isInAddMode: false
})

export default function appReducer (state = initialState, action) {
  switch (action.type) {

    case C.ENTERED_ADD_MODE:
      return state.set('isInAddMode', true)

    case C.EXITED_ADD_MODE:
      return state.set('isInAddMode', false)

    default:
      return state
  }
}
