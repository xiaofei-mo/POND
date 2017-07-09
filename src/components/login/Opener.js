/*
 * Copyright (C) 2017 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see 
 * <http://www.gnu.org/licenses/>.
 */

import React from 'react'

export default class Opener extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    if (
      this.props.isLoggingIn ||
      this.props.isAcceptingPassword ||
      this.props.isAcceptingEmail ||
      this.props.isResettingPassword ||
      this.props.isSendingEmail || 
      this.props.emailSent || 
      this.props.isAcceptingUsername ||
      this.props.isSigningUp
    ) {
      return null
    }
    return (
      <a className='opener' href='#' onClick={this.props.onClick}>
        <span className='blinker'>▌</span>
      </a>
    )
  }
}
