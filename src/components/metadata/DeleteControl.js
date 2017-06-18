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

export default class DeleteControl extends React.Component {
  constructor() {
    super()
    this.state = {
      deleteWasClickedOnce: false
    }
    this._handleClick = this._handleClick.bind(this)
    this._handleNoClick = this._handleNoClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    if (this.state.deleteWasClickedOnce) {
      this.props.deleteItem(this.props.item.get('id'))
    }
    else {
      this.setState({
        deleteWasClickedOnce: true
      })
    }
  }
  _handleNoClick(event) {
    event.preventDefault()
    this.setState({
      deleteWasClickedOnce: false
    })
  }
  render() {
    if (!this.props.userIsOwner) {
      return null
    }
    if (this.state.deleteWasClickedOnce) {
      return (
        <div className='delete-control are-you-sure'>
          <span>Are you sure?</span>
          <a href='#' onClick={this._handleClick} tabIndex='-1'>Yes</a>
          <a href='#' onClick={this._handleNoClick} tabIndex='-1'>No</a>
        </div>
      )
    }
    return (
      <a className='delete-control' 
         href='#' 
         onClick={this._handleClick} 
         tabIndex='-1'>
        Delete
      </a>
    )
  }
}
