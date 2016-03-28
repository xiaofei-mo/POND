import { combineReducers } from 'redux-immutable'
import itemsReducer from './items'
import usersReducer from './users'

export default combineReducers({
  items: itemsReducer,
  users: usersReducer
})
