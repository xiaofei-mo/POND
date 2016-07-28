import { createSelector } from 'reselect'

export default createSelector(
  state => state.getIn(['page', 'scrollLeft']),
  state => state.getIn(['page', 'width']),
  
  (scrollLeft, width) => {
    return scrollLeft + width + width
  }
)
