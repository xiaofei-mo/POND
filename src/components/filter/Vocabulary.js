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
import Terms from './Terms'

export default class Vocabulary extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this._handleDragStart = this._handleDragStart.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.toggleVocabulary(this.props.vocabulary.get('name'))
  }
  _handleDragStart(event) {
    event.preventDefault()
  }
  render() {
    return (
      <li className='vocabulary'>
        <a href='#' 
           onClick={this._handleClick} 
           onDragStart={this._handleDragStart}>
          {this.props.vocabulary.get('name')}
        </a>
        <Terms isOpen={this.props.vocabulary.get('isOpen')} 
               terms={this.props.vocabulary.get('terms')} />
      </li>
    )
  }
}
