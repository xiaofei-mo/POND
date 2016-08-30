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
import getStringFromSeconds from '../../utils/getStringFromSeconds'

export default class Url extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    const timingString = getStringFromSeconds(this.props.item.get('timing'))
    const url = this.props.baseUrl + timingString
    return (
      <li>
        <label>
          <span>URL</span>
          <input readOnly tabIndex='-1' type='text' value={url} />
        </label>
      </li>
    )
  }
}
