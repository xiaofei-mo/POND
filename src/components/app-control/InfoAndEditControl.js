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

import Draggable from 'react-draggable'
import React from 'react'
import ReactDOM from 'react-dom'

export default class InfoAndEditControl extends React.Component {
  constructor() {
    super()
    this.state = {
      height: 0,
      width: 0
    }
    this._handleClick = this._handleClick.bind(this)
    this._handleDragStart = this._handleDragStart.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    if (!this.props.isShowingMetadata) {
      this.props.showMetadata()
    }
    else {
      this.props.hideMetadata()
    }
  }
  _handleDragStart(event) {
    event.preventDefault()
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this)
    if (el !== null && this.state.height === 0 && this.state.width === 0) {
      this.setState({
        height: el.offsetHeight,
        width: el.offsetWidth
      })
    }
  }
  render() {
    if (this.props.windowHeight === 0 && this.props.windowWidth === 0) {
      return null
    }
    const bounds = {
      top: 0,
      right: this.props.windowWidth - this.state.width,
      bottom: this.props.windowHeight - this.state.height,
      left: 0
    }
    const defaultPosition = { x: 40, y: (this.props.windowHeight * 0.10) }
    let className = 'info-and-edit-control app-control'
    let img = <img src='/static/haumea.png' alt='Info &amp Edit' />
    if (!this.props.uploads.isEmpty()) {
      className += ' is-uploading'
      img = <img src='/static/haumea_uploading.gif' alt='Uploading...' />
    }
    return (
      <Draggable bounds={bounds} defaultPosition={defaultPosition}>
        <a className={className}
           href='#' 
           onClick={this._handleClick}
           onDragStart={this._handleDragStart}>
          {img}
        </a>
      </Draggable>
    )
  }
}
