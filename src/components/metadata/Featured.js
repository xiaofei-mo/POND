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

export default class Featured extends React.Component {
  constructor() {
    super()
    this._handleChange = this._handleChange.bind(this)
    this.render = this.render.bind(this)
  }
  _handleChange(event) {
    this.props.updateFeaturedItemId(this.props.item.get('id'))
  }
  render() {
    const isChecked = this.props.featuredItemId === this.props.item.get('id')
    if (this.props.userIsOwner) {
      return (
        <li>
          <label>
            <span>Featured?</span>
            <input checked={isChecked} 
                   onChange={this._handleChange} 
                   tabIndex='-1' 
                   type='checkbox' />
          </label>
        </li>
      )
    }
    return (
      <li>
        <label>
          <span>Featured?</span>
          <input checked={isChecked} 
                 disabled 
                 readOnly 
                 tabIndex='-1' 
                 type='checkbox'  />
        </label>
      </li>
    )
  }
}
