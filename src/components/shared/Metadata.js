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

import DeleteControl from './DeleteControl'
import React from 'react'
import SaveControl from './SaveControl'

export default class Metadata extends React.Component {
  constructor() {
    super()
    // this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  // _handleClick(event) {
  //   event.preventDefault()
  //   this.refs.url.select()
  // }
  render() {
    if (!this.props.isShowingMetadata) {
      return null
    }
    return (
      <div className='metadata'>
        <div className='controls'>
          <SaveControl item={this.props.item}
                       user={this.props.user} />
          <DeleteControl deleteItem={this.props.deleteItem} 
                         item={this.props.item} 
                         user={this.props.user} />
        </div>
      </div>
    )
  }
}

        // <textarea className='url' 
        //           defaultValue={this.props.item.get('url')}
        //           onClick={this._handleClick} 
        //           readOnly
        //           ref='url' />
