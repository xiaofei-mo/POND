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

import Immutable from 'immutable'
import React from 'react'

export default class MetadataItem extends React.Component {
  constructor() {
    super()
    this._handleChange = this._handleChange.bind(this)
    this._handleKeyDown = this._handleKeyDown.bind(this)
    this.render = this.render.bind(this)
  }
  _handleChange(event) {
    event.preventDefault()
    this.props.updateMetadata(this.props.name, event.target.value)
  }
  _handleKeyDown(event) {
    switch (event.which) {
      case 13: 
        event.preventDefault()
        this.props.saveMetadata()
        break
      case 27:
        event.preventDefault()
        this.props.hideMetadata()
        break
    }
  }
  render() {
    let value = this.props.metadata.get(this.props.name)
    if (!this.props.userIsOwner) {
      return (
        <li>
          <label>
            <span>{this.props.label}</span>
            <input disabled
                   readOnly 
                   ref='input'
                   tabIndex={this.props.tabIndex}
                   type='text' 
                   value={value} />
          </label>
        </li>
      )
    }
    return (
      <li>
        <label>
          <span>{this.props.label}</span>
          <input onChange={this._handleChange} 
                 onKeyDown={this._handleKeyDown}
                 ref='input'
                 tabIndex={this.props.tabIndex}
                 type='text' 
                 value={value} />
        </label>
      </li>
    )
  }
}
