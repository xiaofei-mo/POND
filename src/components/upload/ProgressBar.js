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

export default class ProgressBar extends React.Component {
  constructor() {
    super()
    this._getStyle = this._getStyle.bind(this)
    this.render = this.render.bind(this)
  }
  _getStyle() {
    let percent = this.props.percent;
    if (percent < 0) {
      percent = 0
    }
    else if (percent > 100) {
      percent = 100
    }
    return {
      width: percent + '%'
    }
  }
  render() {
    return (
      <div className='progress-bar'>
        <div className='progress' style={this._getStyle()}></div>
      </div>
    )
  }
}
