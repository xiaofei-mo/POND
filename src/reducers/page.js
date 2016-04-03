import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  items: Immutable.Map(),
  centerItem: Immutable.Map(),
  rightmostItem: Immutable.Map()
})

export default function pageReducer (state = initialState, action) {
  let items
  switch (action.type) {
    case C.RECEIVE_CENTER_ITEM:
      return state.merge({
        centerItem: action.centerItem
      })
    case C.RECEIVE_ITEMS:
      items = action.items
      return state.merge({
        items: items,
        rightmostItem: items.maxBy(item => (item.width + item.x))
      })
    case C.VIDEO_IS_READY_TO_PLAY:
      let centerItem = state.get('centerItem')
      items = state.get('items')
      const centerItemId = centerItem.keySeq().first() 
      let isReadyToPlay = centerItemId === action.id
      return state.merge({
          centerItem: centerItem.setIn([centerItemId, 'isReadyToPlay'], isReadyToPlay),
          items: items.setIn([action.id, 'isReadyToPlay'], true)
      })
    default:
      return state
  }
}
