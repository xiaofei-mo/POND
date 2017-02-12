/*
 * Copyright (C) 2017 Mark P. Lindsay
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

import { A } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  isInLinkingMode: false
})

export default function appReducer (state = initialState, action) {
  switch (action.type) {

    case A.PAGE_CLICKED:
      if (state.get('isInLinkingMode')) {
        return state.set('isInLinkingMode', false)
      }
      return state

    case A.SHOW_METADATA:
      return state.set('isInLinkingMode', false)

    case A.TOGGLE_LINKING_MODE:
      return state.set('isInLinkingMode', !state.get('isInLinkingMode'))

    default:
      return state
  }
}
