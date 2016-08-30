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
import Featured from './Featured'
import React from 'react'
import SaveControl from './SaveControl'

export default class Metadata extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    if (!this.props.isShowingMetadata) {
      return null
    }
    let userIsOwner = false
    if (!this.props.user.isEmpty() &&
        this.props.user.get('uid') === this.props.item.get('userId')) {
      userIsOwner = true
    }
    return (
      <div className='metadata'>
        <ul>
          <li>
            <Featured featuredTiming={this.props.featuredTiming} 
                      item={this.props.item} 
                      setFeaturedTiming={this.props.setFeaturedTiming} 
                      userIsOwner={userIsOwner} />
          </li>
        </ul>
        <div className='controls'>
          <SaveControl userIsOwner={userIsOwner} />
          <DeleteControl deleteItem={this.props.deleteItem} 
                         item={this.props.item} 
                         userIsOwner={userIsOwner} />
        </div>
      </div>
    )
  }
}
