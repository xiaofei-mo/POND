import { combineReducers } from 'redux-immutable'
import pageReducer from './page'
import userReducer from './user'
import routerReducer from './router'

export default combineReducers({
  page: pageReducer,
  user: userReducer,
  routing: routerReducer
})
