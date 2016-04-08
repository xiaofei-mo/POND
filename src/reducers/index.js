import { combineReducers } from 'redux-immutable'
import appReducer from './app'
import pageReducer from './page'
import routerReducer from './router'
import userReducer from './user'

export default combineReducers({
  app: appReducer,
  page: pageReducer,
  routing: routerReducer,
  user: userReducer
})
