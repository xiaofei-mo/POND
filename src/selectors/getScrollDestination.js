/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see <http://www.gnu.org/licenses/>.
 */

import { createSelector } from 'reselect'
import getPaddingLeft from './getPaddingLeft'

export default createSelector(
  state => state.getIn(['filter', 'isInFilterMode']),
  state => state.getIn(['page', 'items']),
  state => state.getIn(['filter', 'filteredItems']),
  state => state.getIn(['page', 'destinationItem']),
  state => state.getIn(['page', 'width']),
  getPaddingLeft,

  (isInFilterMode, regularItems, filteredItems, destinationItem, width, paddingLeft) => {
    let items = regularItems
    if (isInFilterMode) {
      items = filteredItems
    }
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
