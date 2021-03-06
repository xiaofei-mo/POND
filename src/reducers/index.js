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

import { combineReducers } from 'redux-immutable'
import appReducer from './app'
import filterReducer from './filter'
import linkReducer from './link'
import pageReducer from './page'
import routerReducer from './router'
import uploadReducer from './upload'
import poetryReducer from './poetry'

export default combineReducers({
  app: appReducer,
  filter: filterReducer,
  link: linkReducer,
  page: pageReducer,
  routing: routerReducer,
  upload: uploadReducer,
  poetry: poetryReducer,
})
