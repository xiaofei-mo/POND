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

      // If the item doesn't have metadata, it will never match on the applied
      // filters. So, we return true to filter (not include) this item.
      if (!item.has('metadata')) {
        return true
      }

      // By default we filter all items.
      let shouldFilter = true

      // For each filter's vocabulary slug, see if the item has any terms that
      // are included in the applied terms.
      appliedFilters.forEach((appliedTerms, slug) => {
        const terms = item.getIn(['metadata', slug], Immutable.Set())
        terms.forEach(term => {
          if (appliedTerms.includes(term)) {
            // If the item has a term that is included, we want to include the
            // item. This means that the filters are a logical OR. Or, as
            // Xiaofei writes in `Wireframe 1106_OLDMENU4MARK.pdf`:
            //
            // "1st selected tag returns all objects to that tag, and subsequent 
            // selections ADD to results."
            shouldFilter = false
          }
        })
      })
      return shouldFilter
    })
  }
)
