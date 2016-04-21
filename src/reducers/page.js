import C from 'src/constants'
import Immutable from 'immutable'
import timingConversion from 'src/utils/timingConversion'
import url from 'url'

const initialState = Immutable.Map({
  height: undefined,
  initiallyScrolled: false,
  items: Immutable.Map(),
  mostRecentlyTouched: undefined,
  paddingLeft: undefined,
  paddingRight: undefined,
  scrollAdjustment: undefined,
  scrollDestination: undefined,
  timingOrUsername: undefined,
  width: undefined
})

export default function pageReducer (state = initialState, action) {
  let items
  let paddingLeft
  switch (action.type) {

    case C.ITEM_WAS_TOUCHED:
      return state.set('mostRecentlyTouched', action.payload.get('id'))

    case C.PAGE_INITIALLY_SCROLLED:
      return state.set('initiallyScrolled', true)

    case C.PAGE_SCROLLED:
      const halfway = Math.floor(state.get('width') / 2) + action.payload.get('scrollLeft')
      return state.set('items', state.get('items').map((item, id) => {
        const zoneLeft = item.get('x') + state.get('paddingLeft')
        const zoneRight = item.get('x') + item.get('width') + state.get('paddingLeft')
        if (halfway > zoneLeft && halfway < zoneRight) {
          return item.set('isMuted', false)
        }
        else {
          return item.set('isMuted', true)
        }
      }))

    case C.RECEIVED_ITEMS:
      if (action.payload.get('items') === null) {
        return state
      }
      items = _hydrateItems(action.payload.get('items'))
      paddingLeft = _getPaddingLeft(items, state.get('width'))
      const scrollDestination = _getScrollDestination({
        destinationItem: action.payload.get('destinationItem'),
        items: items,
        paddingLeft: paddingLeft,
        width: state.get('width')
      })
      let initiallyScrolled = state.get('initiallyScrolled')
      if(state.get('timingOrUsername') !== action.payload.get('timingOrUsername')) {
        initiallyScrolled = false
      }
      return state.merge({
        initiallyScrolled: initiallyScrolled,
        items: items,
        paddingLeft: paddingLeft,
        paddingRight: _getPaddingRight(action.payload.get('items'), state.get('width')),
        scrollAdjustment: _getScrollAdjustment(state.get('paddingLeft'), paddingLeft),
        scrollDestination: scrollDestination,
        timingOrUsername: action.payload.get('timingOrUsername')
      })

    case C.VIDEO_IS_READY_TO_PLAY:
      return state.set('items', state.get('items').map((item, id) => {
        let isReadyToPlay = false
        if (item.get('isReadyToPlay') || 
            id === action.payload.get('readyToPlayId')) {
          isReadyToPlay = true
        }
        return item.set('isReadyToPlay', isReadyToPlay)
      }))

    case C.WINDOW_CHANGED_SIZE:
      paddingLeft = _getPaddingLeft(state.get('items'), action.payload.get('width'))
      return state.merge({
        height: action.payload.get('height'),
        paddingLeft: paddingLeft,
        paddingRight: _getPaddingRight(state.get('items'), action.payload.get('width')),
        width: action.payload.get('width')
      })

    default:
      return state
  }
}

//
// Non-item-related functions
// 

const _getScrollAdjustment = (oldPaddingLeft, newPaddingLeft) => {
  return oldPaddingLeft - newPaddingLeft
}

//
// Items (plural) functions
//

const _getScrollDestination = (params) => {
  // First, figure out which item is our destination. Use the leftmost item as a
  // default.
  let item = params.items.minBy(item => item.get('x'))
  // But if a destinationItem was found in actions/page, use that instead.
  if (params.destinationItem !== undefined) {
    item = params.destinationItem
  }
  return item.get('x') + 
         (params.width / 2) + 
         (item.get('width') / 2) + 
         (params.paddingLeft - params.width)
}

const _getPaddingLeft = (items, width) => {
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

const _getPaddingRight = (items, width) => {
  const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
  if (rightmostItem === undefined) {
    return 0
  }
  return Math.abs(rightmostItem.get('x') + rightmostItem.get('width') + width)
}

const _hydrateItems = (items) => {
  const parsedUrl = url.parse(window.location.href)
  const base = parsedUrl.protocol + '//' + parsedUrl.host + '/'
  return items.map((item) => {
    const string = timingConversion.getStringFromSeconds(item.get('timing'))
    return item.set('url', base + string)
  })
}
