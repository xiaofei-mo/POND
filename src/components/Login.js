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

export default class Login extends React.Component {
  constructor() {
    super()
    this._handleCloserClick = this._handleCloserClick.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this.render = this.render.bind(this)
  }
  _handleCloserClick(event) {
    event.preventDefault()
    this.props.closeLogin()
  }
  _handleSubmit(event) {
    event.preventDefault()
    this.props.attemptLogin(this.refs.email.value, this.refs.password.value)
  }
  render() {
    if (!this.props.login.get('isOpen')) {
      return null
    }
    let failureMessage = null
    if (this.props.login.get('failed')) {
      failureMessage = <div className='error'>Login failed</div>
    }
    return (
      <div>
        <div className='login'>
          <a href='#' onClick={this._handleCloserClick} className='closer'>x</a>
          <form onSubmit={this._handleSubmit}>
            <div className='email-element'>
              <div>
                <label htmlFor='email'>Email</label>
                <input autoComplete='off' id='email' ref='email' type='text' />
              </div>
            </div>
            <div className='password-element'>
              <div>
                <label htmlFor='password'>Password</label>
                <input id='password' ref='password' type='password' />
              </div>
            </div>
            <div className='submit-element'>
              <input type='submit' value='Login' />
              {failureMessage}
            </div>
          </form>
        </div>
        <div className='login-veil veil'>
        </div>
      </div>
    )
  }
}
