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

import Clipboard from 'clipboard'
import getPseudorandomId from '../../utils/getPseudorandomId'
import getStringFromSeconds from '../../utils/getStringFromSeconds'
import React from 'react'

export default class CopyUrl extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.render = this.render.bind(this)
    this.state = {
      targetId: getPseudorandomId(),
      triggerId: getPseudorandomId()
    }
  }
  _handleClick(event) {
    event.preventDefault()
  }
  componentDidMount() {
    const triggerSelector = '#' + this.state.triggerId
    const clipboard = new Clipboard(triggerSelector)
  }
  render() {
    const timingString = getStringFromSeconds(this.props.item.get('timing'))
    const url = this.props.baseUrl + timingString
    const targetSelector = '#' + this.state.targetId
    return (
      <li className='copy-url'>
        <input className='target'
               id={this.state.targetId} 
               readOnly 
               tabIndex='-1' 
               type='text' 
               value={url} />
        <a data-clipboard-target={targetSelector} 
           href='#'
           id={this.state.triggerId}
           onClick={this._handleClick}>Copy URL</a>
      </li>
    )
  }
}
