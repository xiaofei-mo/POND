/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'

export default class SortControl extends React.Component {
  constructor() {
    super()
    this._getClassName = this._getClassName.bind(this)
    this._handleMouseOver = this._handleMouseOver.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'sort-control app-control'
    if (this.props.sortIsOpen) {
      className += ' is-open'
    }
    return className
  }
  _handleMouseOver(event) {
    event.preventDefault()
    this.props.openSort()
  }
  render() {
    return <a className={this._getClassName()} 
              href='#' 
              onMouseOver={this._handleMouseOver}>Sort</a>
  }
}
