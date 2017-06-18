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

export default class Logout extends React.Component {
  constructor () {
    super()
    this.state = {
      isConfirming: false
    }
    this._handleClick = this._handleClick.bind(this)
    this._handleNoClick = this._handleNoClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick (event) {
    event.preventDefault()
    this.setState({
      isConfirming: true
    })
  }
  _handleNoClick (event) {
    event.preventDefault()
    this.setState({
      isConfirming: false
    })
  }
  render () {
    if (this.state.isConfirming) {
      return (
        <div className='logout-confirm'>
          <span className='question'>Logout?</span>
          <a href='#' onClick={this.props.onClick}>Yes</a>
          <span>/</span>
          <a href='#' onClick={this._handleNoClick}>No</a>
        </div>
      )
    }
    return <a className='logout' 
              href='#' 
              onClick={this._handleClick}>{this.props.username}</a>

  }
}
