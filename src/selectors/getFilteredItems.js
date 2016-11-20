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
import Immutable from 'immutable'

export default createSelector(
  state => state.getIn(['page', 'items']),
  state => state.getIn(['filter', 'isInFilterMode']), 
  state => state.getIn(['filter', 'appliedFilters']),
  
  (items, isInFilterMode, appliedFilters) => {
    // Return all items if we're not in filter mode.
    if (!isInFilterMode) {
      return items
    }
    // filterNot means we will only include items that return false. This 
    // answers the question "should we filter this item? true for yes and false 
    // for no."
    return items.filterNot(item => {
      if (!item.has('metadata')) {
        // If the item doesn't have metadata, it will never match on the applied
        // filters. So, we return true to filter (not include) this item.
        return true
      }
      // By default, we filter this item.
      let shouldFilter = true
      // Examine each applied filter.
      appliedFilters.forEach((appliedTerms, slug) => {
        // For each filter's vocabulary slug, see if the item has metadata for 
        // it.
        const terms = item.getIn(['metadata', slug], Immutable.Set())
        // If the applied terms from the filter are contained within the terms
        // in the item's metadata,
        if (appliedTerms.isSubset(terms)) {
          // do not filter out this item. Include it.
          shouldFilter = false
        }
      })
      return shouldFilter
    })
  }
)
