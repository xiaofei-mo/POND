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

export default class InfoMoreInfoControl extends React.Component {
  constructor() {
    super()
    this._handleInfoClick = this._handleInfoClick.bind(this)
    this._handleMoreInfoClick = this._handleMoreInfoClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleInfoClick(event) {
    event.preventDefault()
    this.props.showMetadata()
  }
  _handleMoreInfoClick(event) {
    event.preventDefault()
    console.log('more info click')
  }
  render() {
    if (this.props.isShowingInfo) {
      return <a className='info-more-info-control app-control' 
                href='#' 
                onClick={this._handleMoreInfoClick}>More Info</a>
    }
    return <a className='info-more-info-control app-control' 
              href='#' 
              onClick={this._handleInfoClick}>Info</a>
  }
}
