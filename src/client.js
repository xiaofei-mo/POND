/*
 * Copyright (C) 2017 Mark P. Lindsay
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

import actions from './actions'
import App from './containers/App'
import { applyMiddleware, createStore } from 'redux'
import { browserHistory, IndexRoute, Route, Router } from 'react-router'
import FilterPage from './containers/FilterPage'
import getNoise from './utils/getNoise'
import Page from './containers/Page'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import reducer from './reducers';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import thunk from 'redux-thunk'

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
        <Route path='filter/:search' component={FilterPage} />
        <IndexRoute component={Page} />
        <Route path=':timingOrUsername' component={Page} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('mount')
)

store.dispatch(actions.setBaseUrl(window.location.href))

window.addEventListener('resize', () => {
  store.dispatch(actions.setWindowSize(window.innerWidth, window.innerHeight))
})
window.dispatchEvent(new Event('resize'))


// "Xiaofei's Rays"
var inc = 0.005
var xoff = 0.0
function castRay (timestamp) {
  xoff += inc
  let alpha = getNoise(xoff)
  let backgroundColor = 'rgba(0, 0, 0, ' + alpha.toString() + ')'
  document.body.style.backgroundColor = backgroundColor
  window.requestAnimationFrame(castRay)
}
// window.requestAnimationFrame(castRay)
