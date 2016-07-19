import { createSelector } from 'reselect'

export default createSelector(
  state => state.getIn(['page', 'items']),
  state => state.getIn(['page', 'width']),

  (items, width) => {
    const rightmostItem = items.maxBy(item => (item.get('width') + item.get('x')))
    if (rightmostItem === undefined) {
      return 0
    }
    return Math.abs(rightmostItem.get('x') + rightmostItem.get('width') + width)
  }
)
