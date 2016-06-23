/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

import C from 'src/constants'
import Immutable from 'immutable'
import getStringFromSeconds from 'src/utils/getStringFromSeconds'
import url from 'url'

const initialState = Immutable.Map({
  items: Immutable.Map()
})

export default function pageReducer (state = initialState, action) {
  switch (action.type) {

    case C.ITEM_TOUCHED:
      return _handleItemWasTouched(
        action.payload.get('id'), 
        state
      )
      
    case C.PAGE_INITIALLY_SCROLLED:
      return _handlePageInitiallyScrolled(
        state
      )

    case C.PAGE_SCROLLED:
      return _handlePageScrolled(
        action.payload.get('scrollLeft'), 
        state
      )

    case C.RECEIVED_ITEMS:
      return _handleReceivedItems(
        action.payload.get('items'), 
        action.payload.get('destinationItem'),
        action.payload.get('timingOrUsername'),
        state
      )

    case C.SET_BASE_URL:
      return _handleSetBaseUrl(
        action.payload.get('href'), 
        state
      )

    case C.VIDEO_IS_READY_TO_PLAY:
      return _handleVideoIsReadyToPlay(
        action.payload.get('readyToPlayId'), 
        state
      )

    case C.WINDOW_CHANGED_SIZE:
      return _handleWindowChangedSize(
        action.payload.get('height'),
        action.payload.get('width'), 
        state
      )

    default:
      return state
  }
}

const _handleItemWasTouched = (id, state) => {
  return state.set('mostRecentlyTouched', id)
}

const _handlePageInitiallyScrolled = (state) => {
  return state.set('initiallyScrolled', true)
}

const _handlePageScrolled = (scrollLeft, state) => {
  const halfway = _getHalfway(state.get('width'), scrollLeft)
  const items = _setIsMuted(state.get('items'), halfway, state.get('paddingLeft'))
  return state.merge({
    halfway: halfway,
    items: items,
    scrollLeft: scrollLeft
  })
}

const _handleReceivedItems = (items, destinationItem, timingOrUsername, state) => {
  if (items === null) {
    return state
  }
  const paddingLeft = _getPaddingLeft(items, state.get('width'))
  const paddingRight = _getPaddingRight(items, state.get('width'))
  const scrollAdjustment = _getScrollAdjustment(state.get('paddingLeft'), paddingLeft)
  items = _setUrls(items, state.get('baseUrl'))
  items = _setIsMuted(items, state.get('halfway'), paddingLeft)
  const scrollDestination = _getScrollDestination(
    destinationItem,
    items,
    paddingLeft,
    state.get('width')
  )
  const initiallyScrolled = _getInitiallyScrolled(
    state.get('timingOrUsername'), 
    timingOrUsername, 
    state.get('initiallyScrolled')
  )
  return state.merge({
    initiallyScrolled: initiallyScrolled,
    items: items,
    paddingLeft: paddingLeft,
    paddingRight: paddingRight,
    scrollAdjustment: scrollAdjustment,
    scrollDestination: scrollDestination,
    timingOrUsername: timingOrUsername
  })
}

const _handleSetBaseUrl = (href, state) => {
  const parsedUrl = url.parse(href)
  return state.set('baseUrl', parsedUrl.protocol + '//' + parsedUrl.host + '/')
}

const _handleVideoIsReadyToPlay = (readyToPlayId, state) => {
  return state.set('items', state.get('items').map((item, id) => {
    let isReadyToPlay = false
    if (item.get('isReadyToPlay') || id === readyToPlayId) {
      isReadyToPlay = true
    }
    return item.set('isReadyToPlay', isReadyToPlay)
  }))
}

const _handleWindowChangedSize = (height, width, state) => {
  const halfway = _getHalfway(width, state.get('scrollLeft'))
  const paddingLeft = _getPaddingLeft(state.get('items'), width)
  const paddingRight = _getPaddingRight(state.get('items'), width)
  const scrollAdjustment = _getScrollAdjustment(state.get('paddingLeft'), paddingLeft)
  const items = _setIsMuted(state.get('items'), halfway, paddingLeft)
  return state.merge({
    height: height,
    items: items,
    paddingLeft: paddingLeft,
    paddingRight: paddingRight,
    scrollAdjustment: scrollAdjustment,
    width: width
  })

}

//
// Non-item-related functions
// 

const _getHalfway = (width, scrollLeft) => {
  return Math.floor(width / 2) + scrollLeft
}

const _getInitiallyScrolled = (oldTimingOrUsername, newTimingOrUsername, initiallyScrolled) => {
  if(oldTimingOrUsername !== newTimingOrUsername) {
    initiallyScrolled = false
  }
  return initiallyScrolled
}

const _getScrollAdjustment = (oldPaddingLeft, newPaddingLeft) => {
  return oldPaddingLeft - newPaddingLeft
}

//
// Items (plural) functions
//

const _getScrollDestination = (destinationItem, items, paddingLeft, width) => {
  // First, figure out which item is our destination. Use the leftmost item as a
  // default.
  let item = items.minBy(item => item.get('x'))
  // But if a destinationItem was found in actions/page, use that instead.
  if (destinationItem !== undefined) {
    item = destinationItem
  }
  return item.get('x') + 
         (width / 2) + 
         (item.get('width') / 2) + 
         (paddingLeft - width)
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

const _setIsMuted = (items, halfway, paddingLeft) => {
  if (halfway === undefined || paddingLeft === undefined) {
    return items
  }
  return items.map((item, id) => {
    const zoneLeft = item.get('x') + paddingLeft
    const zoneRight = item.get('x') + item.get('width') + paddingLeft
    if (halfway > zoneLeft && halfway < zoneRight) {
      return item.set('isMuted', false)
    }
    else {
      return item.set('isMuted', true)
    }
  })
}

const _setUrls = (items, baseUrl) => {
  return items.map((item) => {
    const string = getStringFromSeconds(item.get('timing'))
    return item.set('url', baseUrl + string)
  })
}
