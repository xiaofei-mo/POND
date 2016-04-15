import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  centerItems: Immutable.Map(),
  height: 0,
  initiallyScrolledToCenter: false,
  items: Immutable.Map(),
  mostRecentlyTouched: undefined,
  paddingLeft: 0,
  paddingRight: 0,
  scrollAdjustment: 0,
  timing: undefined,
  width: 0
})

export default function pageReducer (state = initialState, action) {
  let items
  let paddingLeft
  switch (action.type) {

    case C.ITEM_WAS_TOUCHED:
      items = _getProcessedItems({
        items: state.get('items'), 
        mostRecentlyTouched: action.payload.get('id'),
        paddingLeft: state.get('paddingLeft'),
        timing: state.get('timing'), 
        width: state.get('width')
      })
      return state.merge({
        items: items,
        mostRecentlyTouched: action.payload.get('id')
      })

    case C.PAGE_INITIALLY_SCROLLED_TO_CENTER:
      return state.set('initiallyScrolledToCenter', true)

    case C.RECEIVED_ITEMS_AND_TIMING:
      paddingLeft = _getPaddingLeft(action.payload.get('items'), state.get('width'))
      items = _getProcessedItems({
        items: action.payload.get('items'), 
        mostRecentlyTouched: state.get('mostRecentlyTouched'),
        paddingLeft: paddingLeft,
        timing: action.payload.get('timing'), 
        width: state.get('width')
      })
      return state.merge({
        centerItems: _getCenterItems(items),
        items: items,
        paddingLeft: paddingLeft,
        paddingRight: _getPaddingRight(items, state.get('width')),
        scrollAdjustment: _getScrollAdjustment(state.get('paddingLeft'), paddingLeft),
        timing: action.payload.get('timing')
      })

    case C.VIDEO_IS_READY_TO_PLAY:
      items = _getProcessedItems({
        items: state.get('items'), 
        mostRecentlyTouched: state.get('mostRecentlyTouched'),
        paddingLeft: state.get('paddingLeft'), 
        readyToPlayId: action.payload.get('id'),
        timing: state.get('timing'),
        width: state.get('width')
      })
      return state.merge({
        centerItems: _getCenterItems(items),
        items: items
      })

    case C.WINDOW_CHANGED_SIZE:
      paddingLeft = _getPaddingLeft(state.get('items'), action.payload.get('width'))
      items = _getProcessedItems({
        items: state.get('items'), 
        mostRecentlyTouched: state.get('mostRecentlyTouched'),
        paddingLeft: paddingLeft,
        timing: state.get('timing'), 
        width: action.payload.get('width')
      })
      return state.merge({
        centerItems: _getCenterItems(items),
        height: action.payload.get('height'),
        items: items,
        paddingLeft: paddingLeft,
        paddingRight: _getPaddingRight(items, action.payload.get('width')),
        width: action.payload.get('width'),
      })

    default:
      return state
  }
}

//
// Non-item-related functions
// 

function _getScrollAdjustment (oldPaddingLeft, newPaddingLeft) {
  return oldPaddingLeft - newPaddingLeft
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
      mostRecentlyTouched: _getMostRecentlyTouched(id, params.mostRecentlyTouched),
      scrollDestination: _getScrollDestination(item, params.paddingLeft, params.width)
    })
  })
}

function _getPaddingLeft (items, width) {
  const leftmostItem = items.minBy(item => item.get('x'))
  if (leftmostItem === undefined) {
    return 0
  }
  const x = leftmostItem.get('x')
  if (x > 0) {
    return width - x
  }
  else {
    return Math.abs(x) + width
  }
  return 0
}

function _getPaddingRight (items, width) {
  const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
  if (rightmostItem === undefined) {
    return 0
  }
  return Math.abs(rightmostItem.get('x') + rightmostItem.get('width') + width)
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

function _getMostRecentlyTouched (id, mostRecentlyTouched) {
  return id === mostRecentlyTouched
}
