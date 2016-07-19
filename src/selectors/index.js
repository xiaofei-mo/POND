import { createSelector } from 'reselect'
import getStringFromSeconds from '../utils/getStringFromSeconds'
import url from 'url'

const _getBaseUrl = createSelector(
  state => state.getIn(['page', 'href']),

  (href) => {
    console.log('href = ', href)
    const parsedUrl = url.parse(href)
    return parsedUrl.protocol + '//' + parsedUrl.host + '/'
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
