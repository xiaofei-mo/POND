import { createSelector } from 'reselect'
import getStringFromSeconds from '../utils/getStringFromSeconds'
import url from 'url'

const _getBaseUrl = createSelector(
  state => state.getIn(['page', 'href']),

  (href) => {
    const parsedUrl = url.parse(href)
    return parsedUrl.protocol + '//' + parsedUrl.host + '/'
  }
)

export const getHalfway = createSelector(
  state => state.getIn(['page', 'width']),
  state => state.getIn(['page', 'scrollLeft']),

  (width, scrollLeft) => {
    return Math.floor(width / 2) + scrollLeft
  }
)

export const getItems = createSelector(
  state => state.getIn(['page', 'items']),
  _getBaseUrl,

  (items, baseUrl) => {
    return items.map((item) => {
      const string = getStringFromSeconds(item.get('timing'))
      item = item.set('url', baseUrl + string)
      return item
    })
  }
)

export const getPaddingLeft = createSelector(
  getItems,
  state => state.getIn(['page', 'width']),
  
  (items, width) => {
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
)

export const getPaddingRight = createSelector(
  getItems,
  state => state.getIn(['page', 'width']),

  (items, width) => {
    const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
    if (rightmostItem === undefined) {
      return 0
    }
    return Math.abs(rightmostItem.get('x') + rightmostItem.get('width') + width)
  }
)

export const getScrollDestination = createSelector(
  getItems,
  state => state.getIn(['page', 'destinationItem']),
  state => state.getIn(['page', 'width']),
  getPaddingLeft,

  (items, destinationItem, width, paddingLeft) => {
    if (items.isEmpty() || width === 0) {
      return null
    }
    // First, figure out which item is our destination. Use the leftmost item as a
    // default.
    let item = items.minBy(item => item.get('x'))
    // But if a destinationItem was found in actions/page, use that instead.
    if (!destinationItem.isEmpty()) {
      item = destinationItem
    }
    return item.get('x') + 
           (width / 2) + 
           (item.get('width') / 2) + 
           (paddingLeft - width)
  }
)
