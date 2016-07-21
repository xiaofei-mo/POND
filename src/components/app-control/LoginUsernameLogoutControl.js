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

import React from 'react'
import { Link } from 'react-router'

export default class LoginUsernameLogoutControl extends React.Component {
  constructor() {
    super()
    this._handleLoginClick = this._handleLoginClick.bind(this)
    this._handleLogoutClick = this._handleLogoutClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleLoginClick(event) {
    event.preventDefault()
    this.props.openLogin()
  }
  _handleLogoutClick(event) {
    event.preventDefault()
    this.props.logout()
  }
  render() {
    if (!this.props.authDataIsLoaded) {
      return null
    }
    if (!this.props.authData.isEmpty()) {
      // A user is logged in. Are they on their personal page?
      const username = this.props.authData.get('username')
      const timingOrUsername = this.props.params.timingOrUsername
      if (username === timingOrUsername) {
        return <a className='login-username-logout-control app-control' 
                  href='#' 
                  onClick={this._handleLogoutClick}>Logout</a>
      }
      else {
        return <Link className='login-username-logout-control app-control' 
                     to={'/' + username}>{username}</Link>
      }
      label = <span>{this.props.authData.get('username')}</span>
    }
    return <a className='login-username-logout-control app-control' 
              href='#' 
              onClick={this._handleLoginClick}>Login</a>
  }
}
