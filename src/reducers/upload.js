import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  uploads: Immutable.Map()
})

export default function uploadReducer (state = initialState, action) {
  switch (action.type) {
    case C.RECEIVED_UPLOADS:
      return state.set('uploads', action.payload.get('uploads'))

    default:
      return state
  }
}
