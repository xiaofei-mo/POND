import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import actions from 'src/actions'
import reducer from 'src/reducers';
import Page from 'src/containers/Page'
import url from 'url';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

let store = applyMiddleware(thunk)(createStore)(reducer)

const history = syncHistoryWithStore(browserHistory, store, { 
  selectLocationState: function (state) {
    return state.get('routing').toJS()
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/(:timing)' component={Page} />
    </Router>
  </Provider>,
  document.getElementById('mount')
)
