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
  uploads: Immutable.Map()
})

export default function uploadReducer (state = initialState, action) {
  switch (action.type) {
    case C.RECEIVED_UPLOADS:
      return state.set('uploads', action.payload.get('uploads'))

    default:
      return state
  }
}
