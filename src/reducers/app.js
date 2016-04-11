import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({})

export default function appReducer (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
