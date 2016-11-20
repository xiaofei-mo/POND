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

import getAppliedFilters from './getAppliedFilters'
import Immutable from 'immutable'
import queryString from 'query-string'

export default function toggleFilter (slug, term) {
  let appliedFilters = getAppliedFilters()
  if (appliedFilters.has(slug)) {
    let appliedTerms = appliedFilters.get(slug)
    if (appliedTerms.contains(term)) {
      appliedTerms = appliedTerms.delete(term)
    }
    else {
      appliedTerms = appliedTerms.add(term)
    }
    if (!appliedTerms.isEmpty()) {
      appliedFilters = appliedFilters.set(slug, appliedTerms)
    }
    else {
      appliedFilters = appliedFilters.delete(slug)
    }
  }
  else {
    appliedFilters = appliedFilters.set(slug, Immutable.Set([term]))
  }
  if (appliedFilters.isEmpty()) {
    location.hash = ''
  }
  else {
    location.hash = queryString.stringify(appliedFilters.toJS())
  }
}
