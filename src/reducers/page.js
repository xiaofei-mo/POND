import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  centerItem: Immutable.Map(),
  height: 0,
  items: Immutable.Map(),
  rightmostEdge: 0,
  initiallyScrolledToCenter: false,
  width: 0
})

export default function pageReducer (state = initialState, action) {
  let centerItem
  let centerItemId
  let items
  switch (action.type) {
    case C.RECEIVE_CENTER_ITEM:
      centerItem = action.centerItem
      centerItemId = _getCenterItemId(centerItem)
      let scrollDestination = _getScrollDestination(centerItem.first(), state.get('width'))
      centerItem = centerItem.setIn([centerItemId, 'scrollDestination'], scrollDestination)
      return state.merge({
        centerItem: centerItem
      })
    case C.RECEIVE_ITEMS:
      items = action.items
      return state.merge({
        items: items,
        rightmostEdge: _getRightmostEdge(action.items, state.get('width'))
      })
    case C.PAGE_INITIALLY_SCROLLED_TO_CENTER:
      return state.set('initiallyScrolledToCenter', true)
    case C.VIDEO_IS_READY_TO_PLAY:
      centerItem = state.get('centerItem')
      items = state.get('items')
      centerItemId = _getCenterItemId(centerItem)
      let isReadyToPlay = centerItemId === action.id
      return state.merge({
          centerItem: centerItem.setIn([centerItemId, 'isReadyToPlay'], isReadyToPlay),
          items: items.setIn([action.id, 'isReadyToPlay'], true)
      })
    case C.WINDOW_CHANGED_SIZE:
      return state.merge({
        width: action.width,
        height: action.height,
        rightmostEdge: _getRightmostEdge(state.get('items'), action.width)
      })
    default:
      return state
  }
}

function _getCenterItemId (centerItem) {
  return centerItem.keySeq().first()
}

function _getScrollDestination (item, windowWidth) {
  return item.get('x') - (windowWidth / 2) + (item.get('width') / 2)
}

function _getRightmostEdge (items, windowWidth) {
  const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
  if (rightmostItem === undefined) {
    return 0
  }
  let width = rightmostItem.get('width')
  let x = rightmostItem.get('x')
  return (width / 2) + x + windowWidth
}
