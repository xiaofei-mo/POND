import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  droppedFiles: false
})

export default function appReducer (state = initialState, action) {
  switch (action.type) {

    case C.FILES_WERE_DROPPED:
      return state.set('droppedFiles', action.files)

    default:
      return state
  }
}
