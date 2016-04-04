import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  centerItems: Immutable.Map(),
  height: 0,
  items: Immutable.Map(),
  rightmostEdge: 0,
  initiallyScrolledToCenter: false,
  timing: undefined,
  width: 0
})

export default function pageReducer (state = initialState, action) {
  let items
  switch (action.type) {

    case C.RECEIVE_ITEMS_AND_TIMING:
      items = _getProcessedItems(action.items, action.timing, state.get('width'))
      return state.merge({
        centerItems: _getCenterItems(items),
        items: items,
        rightmostEdge: _getRightmostEdge(items, state.get('width')),
        timing: action.timing
      })

    case C.PAGE_INITIALLY_SCROLLED_TO_CENTER:
      return state.set('initiallyScrolledToCenter', true)

    case C.VIDEO_CHANGED_POSITION:
      return state

    case C.VIDEO_IS_READY_TO_PLAY:
      items = _getProcessedItems(state.get('items'), state.get('timing'), state.get('width'), action.id)
      return state.merge({
        centerItems: _getCenterItems(items),
        items: items
      })

    case C.WINDOW_CHANGED_SIZE:
      items = _getProcessedItems(state.get('items'), state.get('timing'), action.width)
      return state.merge({
        centerItems: _getCenterItems(items),
        height: action.height,
        items: items,
        rightmostEdge: _getRightmostEdge(items, action.width),
        width: action.width,
      })

    default:
      return state
  }
}

//
// Items (plural) functions
//

function _getCenterItems (items) {
  return items.filter(i => i.get('isCenter'))
}

function _getProcessedItems (items, timing, width, readyToPlayId) {
  return items.map((item, id) => {
    item = item.set('scaledX', _getScaledX(item, width))
    return item.merge({
      isCenter: _getIsCenter(item, timing),
      isReadyToPlay: _getIsReadyToPlay(item, id, readyToPlayId),
      scrollDestination: _getScrollDestination(item, width)
    })
  })
}

function _getRightmostEdge (items, width) {
  const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
  if (rightmostItem === undefined) {
    return 0
  }
  const rightmostEdge = rightmostItem.get('width') + rightmostItem.get('x') + width
  const scaledRightmostEdge = rightmostItem.get('width') + rightmostItem.get('scaledX') + width
  return scaledRightmostEdge
}

//
// Item (singular) functions
//

function _getIsCenter (item, timing) {
  if(timing === undefined) {
    return item.get('isFeatured')
  }
  return item.get('timing') === timing
}

function _getIsReadyToPlay (item, id, readyToPlayId) {
  if(item.get('isReadyToPlay')) {
    return true
  }
  if(readyToPlayId === undefined) {
    return false
  }
  return id === readyToPlayId
}

function _getScaledX (item, width) {
  return item.get('x') + width
}

function _getScrollDestination (item, width) {
  const destX = item.get('x') - (width / 2) + (item.get('width') / 2)
  const destScaledX = item.get('scaledX') - (width / 2) + (item.get('width') / 2)
  return destScaledX
}
