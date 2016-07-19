import { createSelector } from 'reselect'

export default createSelector(
  state => state.getIn(['page', 'items']),
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
    return Math.abs(x) + width
  }
)