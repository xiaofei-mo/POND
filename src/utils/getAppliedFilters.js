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

import Immutable from 'immutable'
import queryString from 'query-string'

export default function getAppliedFilters () {
  const search = location.hash.replace(/#/, '')
  let appliedFilters = Immutable.fromJS(queryString.parse(search))
  appliedFilters = appliedFilters.map((afs, slug) => {
    if (Immutable.List.isList(afs)) {
      return Immutable.Set(afs)
    }
    else {
      return Immutable.Set([afs])
    }
  })
  return appliedFilters
}
