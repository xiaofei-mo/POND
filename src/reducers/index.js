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

import { combineReducers } from 'redux-immutable'
import appReducer from './app'
import pageReducer from './page'
import routerReducer from './router'
import sortReducer from './sort'
import uploadReducer from './upload'
import userReducer from './user'

export default combineReducers({
  app: appReducer,
  page: pageReducer,
  routing: routerReducer,
  sort: sortReducer,
  upload: uploadReducer,
  user: userReducer
})
