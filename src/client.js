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

store.dispatch(actions.setBaseUrl(window.location.href))

window.addEventListener('resize', () => {
  store.dispatch(actions.setWindowSize(window.innerWidth, window.innerHeight))
})
window.dispatchEvent(new Event('resize'))
