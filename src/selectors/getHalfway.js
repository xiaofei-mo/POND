import { createSelector } from 'reselect'

export default createSelector(
  state => state.getIn(['page', 'width']),
  state => state.getIn(['page', 'scrollLeft']),

  (width, scrollLeft) => {
    return Math.floor(width / 2) + scrollLeft
  }
)
