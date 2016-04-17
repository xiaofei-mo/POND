import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import actions from 'src/actions'
import reducer from 'src/reducers';
import App from 'src/containers/App'
import Page from 'src/containers/Page'
import url from 'url';
import { browserHistory, IndexRoute, Route, Router } from 'react-router'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'

let store = applyMiddleware(
  thunk, 
  routerMiddleware(browserHistory)
)(createStore)(reducer)

const history = syncHistoryWithStore(browserHistory, store, { 
  selectLocationState: function (state) {
    return state.get('routing').toJS()
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Page} />
        <Route path=':timingOrUsername' component={Page} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('mount')
)

window.addEventListener('resize', () => {
  store.dispatch(actions.setWindowSize(window.innerWidth, window.innerHeight))
})
window.dispatchEvent(new Event('resize'))
