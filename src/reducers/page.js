import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  centerItems: Immutable.Map(),
  height: 0,
  initiallyScrolledToCenter: false,
  isInAddMode: false,
  items: Immutable.Map(),
  paddingLeft: 0,
  rightmostEdge: 0,
  timing: undefined,
  width: 0
})

export default function pageReducer (state = initialState, action) {
  let items
  let paddingLeft
  switch (action.type) {

    case C.ENTERED_ADD_MODE:
      return state.set('isInAddMode', true)

    case C.EXITED_ADD_MODE:
      return state.set('isInAddMode', false)

    case C.RECEIVE_ITEMS_AND_TIMING:
      paddingLeft = _getPaddingLeft(action.items, state.get('width'))
      items = _getProcessedItems({
        items: action.items, 
        timing: action.timing, 
        paddingLeft: paddingLeft,
        width: state.get('width')
      })
      return state.merge({
        centerItems: _getCenterItems(items),
        items: items,
        paddingLeft: paddingLeft,
        rightmostEdge: _getRightmostEdge(items, state.get('width')),
        timing: action.timing
      })

    case C.PAGE_INITIALLY_SCROLLED_TO_CENTER:
      return state.set('initiallyScrolledToCenter', true)

    case C.VIDEO_IS_READY_TO_PLAY:
      items = _getProcessedItems({
        items: state.get('items'), 
        timing: state.get('timing'), 
        paddingLeft: state.get('paddingLeft'), 
        readyToPlayId: action.id,
        width: state.get('width')
      })
      return state.merge({
        centerItems: _getCenterItems(items),
        items: items
      })

    case C.WINDOW_CHANGED_SIZE:
      paddingLeft = _getPaddingLeft(state.get('items'), action.width)
      items = _getProcessedItems({
        items: state.get('items'), 
        timing: state.get('timing'), 
        paddingLeft: paddingLeft,
        width: action.width
      })
      return state.merge({
        centerItems: _getCenterItems(items),
        height: action.height,
        items: items,
        paddingLeft: paddingLeft,
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

function _getProcessedItems (params) {
  return params.items.map((item, id) => {
    return item.merge({
      isCenter: _getIsCenter(item, params.timing),
      isReadyToPlay: _getIsReadyToPlay(item, id, params.readyToPlayId),
      scrollDestination: _getScrollDestination(item, params.paddingLeft, params.width)
    })
  })
}

function _getPaddingLeft (items, width) {
  const leftmostItem = items.minBy(item => item.get('x'))
  if (leftmostItem === undefined) {
    return 0
  }
  return Math.abs(leftmostItem.get('x')) + width
}

function _getRightmostEdge (items, width) {
  const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
  if (rightmostItem === undefined) {
    return 0
  }
  return rightmostItem.get('width') + rightmostItem.get('x') + width
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

function _getScrollDestination (item, paddingLeft, width) {
  return item.get('x') + (width / 2) + (item.get('width') / 2) + (paddingLeft - width)
}
