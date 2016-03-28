import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import actions from 'src/actions'
import reducer from 'src/reducers';
import Items from 'src/containers/Items'

let store = applyMiddleware(thunk)(createStore)(reducer)

ReactDOM.render(
  <Provider store={store}>
    <Items />
  </Provider>,
  document.getElementById('mount')
)

setTimeout(() => {
  store.dispatch(actions.startListeningToItems())
  store.dispatch(actions.startListeningToUsers())
})
