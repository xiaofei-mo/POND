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

import { A } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  isShowingMetadata: false,
  login: Immutable.Map({
    failed: false,
    isOpen: false
  }),
  user: Immutable.Map(),
  userIsLoaded: false
})

export default function appReducer (state = initialState, action) {
  let newState
  switch (action.type) {

    case A.CLOSE_LOGIN:
      return state.setIn(['login', 'isOpen'], false)

    case A.HIDE_METADATA:
      return state.merge({
        isShowingMetadata: false
      })

    case A.LOGIN_FAILED:
      return state.setIn(['login', 'failed'], true)

    case A.OPEN_LOGIN:
      return state.set('login', Immutable.Map({
        isOpen: true,
        failed: false
      }))

    case A.RECEIVED_USER:
      return state.merge({
        login: state.set('login', Immutable.Map({
          isOpen: false,
          failed: false
        })),
        user: action.payload.get('user'),
        userIsLoaded: true
      })

    case A.SHOW_METADATA:
      return state.merge({
        isShowingMetadata: true
      })

    default:
      return state
  }
}
