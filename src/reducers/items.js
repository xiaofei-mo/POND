import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  items: Immutable.Map(),
  rightmostEdge: 0
})

function _getRightmostEdge (items) {
  if(items.size === 0) {
    return 0
  }
  let rightmostItem = items.maxBy(item => (item.width + item.x))
  let width = rightmostItem.get('width')
  let x = rightmostItem.get('x')
  return (width / 2) + x + (window.innerWidth / 2)
}

export default function itemsReducer (state = initialState, action) {
  switch (action.type) {
    case C.RECEIVE_ITEMS:
      const items = action.data
      return state.merge({
        items: items,
        rightmostEdge: _getRightmostEdge(items)
      })
    case C.VIDEO_IS_READY_TO_PLAY:
      return state.setIn(['items', action.id, 'isVisible'], true)
    default:
      return state
  }
}
