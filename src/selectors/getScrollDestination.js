import { createSelector } from 'reselect'
import getPaddingLeft from './getPaddingLeft'

export default createSelector(
  state => state.getIn(['page', 'items']),
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
