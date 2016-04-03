import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  locationBeforeTransitions: null
})

export default function routerReducer(state = initialState, { type, payload }) {
  if (type === C.LOCATION_CHANGE) {
    return state.merge({
      locationBeforeTransitions: Immutable.fromJS(payload)
    })
  }
  return state
}
