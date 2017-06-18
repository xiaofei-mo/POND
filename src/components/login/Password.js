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

export default class Password extends React.Component {
  constructor () {
    super()
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.render = this.render.bind(this)
  }
  componentDidUpdate (prevProps) {
    if (!prevProps.isAcceptingPassword && this.props.isAcceptingPassword) {
      this.refs.input.focus()
    }
  }
  render () {
    if (!this.props.isAcceptingPassword) {
      return null
    }
    return <input onChange={this.props.onChange}
                  onKeyUp={this.props.onKeyUp}
                  placeholder='password'
                  ref='input'
                  type='password' 
                  value={this.props.password} />
  }
}
