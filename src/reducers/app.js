/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

import C from 'src/constants'
import Immutable from 'immutable'

const initialState = Immutable.Map({
  authData: null,
  isShowingMetadata: false,
  login: Immutable.Map({
    failed: false,
    isOpen: false
  })
})

export default function appReducer (state = initialState, action) {
  let newState
  switch (action.type) {

    case C.CLOSE_LOGIN:
      return state.setIn(['login', 'isOpen'], false)

    case C.HIDE_METADATA:
      return state.merge({
        isShowingMetadata: false
      })

    case C.LOGIN_FAILED:
      return state.setIn(['login', 'failed'], true)

    case C.OPEN_LOGIN:
      return state.set('login', Immutable.Map({
        isOpen: true,
        failed: false
      }))

    case C.RECEIVED_AUTH_DATA:
      return state.merge({
        authData: action.payload.get('authData'),
        login: state.set('login', Immutable.Map({
          isOpen: false,
          failed: false
        }))
      })

    case C.SHOW_METADATA:
      return state.merge({
        isShowingMetadata: true
      })

    default:
      return state
  }
}
