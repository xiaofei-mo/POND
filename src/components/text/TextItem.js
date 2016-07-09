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

import { DraggableCore } from 'react-draggable'
import { Link } from 'react-router'
import Metadata from '../shared/Metadata'
import React from 'react'
import { Resizable } from 'react-resizable'

export default class TextItem extends React.Component {
  constructor() {
    super()
    this.state = {
      height: 0,
      style: {
        width: '0px',
        height: '0px',
        transform: 'translate(0px, 0px)'
      },
      wasDragged: false,
      width: 0,
      x: 0,
      y: 0
    }
    this._getClassName = this._getClassName.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._handleDrag = this._handleDrag.bind(this)
    this._handleDragStop = this._handleDragStop.bind(this)
    this._handleMouseDown = this._handleMouseDown.bind(this)
    this._handleResize = this._handleResize.bind(this)
    this._handleResizeStop = this._handleResizeStop.bind(this)
    this._setStyle = this._setStyle.bind(this)
    this._truncateText = this._truncateText.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    var className = 'text-item'
    if (this.props.item.get('mostRecentlyTouched')) {
      className += ' most-recently-touched'
    }
    if (this.props.isShowingMetadata) {
      className += ' is-showing-metadata'
    }
    return className
  }
  _handleClick(event) {
    if (this.state.wasDragged) {
      event.preventDefault()
    }
  }
  _handleDrag(event, ui) {
    if (this.props.isShowingMetadata) {
      return false
    }
    const x = this.state.x + ui.deltaX
    let y = this.state.y + ui.deltaY
    const bottom = y + this.props.item.get('height')
    if (bottom > this.props.height) {
      y = this.props.height - this.props.item.get('height')
    }
    this.setState({
      height: this.state.height,
      style: {
        height: this.state.style.height,
        width: this.state.style.width,
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: true,
      width: this.state.width,
      x: x,
      y: y,
    })
  }
  _handleMouseDown(event) {
    if (this.props.isShowingMetadata) {
      return false
    }
    this.props.setMostRecentlyTouched(this.props.id)
    let state = this.state
    state['wasDragged'] = false
    this.setState(state)
  }
  _handleResize(event, ui) {
    this.setState({
      height: ui.size.height,
      style: {
        height: ui.size.height + 'px',
        width: ui.size.width + 'px',
        transform: 'translate(' + this.state.x + 'px, ' + this.state.y + 'px)'
      },
      wasDragged: this.state.wasDragged,
      width: ui.size.width,
      x: this.state.x,
      y: this.state.y
    })
  }
  _handleResizeStop(event, ui) {
    this.props.setItemSize(this.props.id, this.state.height, this.state.width)
  }
  _handleDragStop(event, ui) {
    this.props.setItemPosition(this.props.id, this.state.x, this.state.y)
  }
  _setStyle(props) {
    const x = props.item.get('x')
    const y = props.item.get('y')
    this.setState({
      height: props.item.get('height'),
      style: {
        height: props.item.get('height') + 'px',
        width: props.item.get('width') + 'px',
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: this.state.wasDragged,
      width: props.item.get('width'),
      x: x,
      y: y
    })
  }
  _truncateText() {
    let el = this.refs.textItemContent
    let setTitleOnce = function () {
      el.title = el.textContent;
      setTitleOnce = function () {};
    };
    while (el.scrollHeight - (el.clientHeight || el.offsetHeight) >= 1) {
      if (el.textContent === '...') {
        break;
      }
      setTitleOnce();
      el.textContent = el.textContent.replace(/(.|\s)(\.\.\.)?$/, '...');
    }
  }
  componentDidMount() {
    this._truncateText()
  }
  componentDidUpdate() {
    this._truncateText()
  }
  componentWillMount() {
    this._setStyle(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.item.get('height') !== nextProps.item.get('height') ||
        this.props.item.get('width') !== nextProps.item.get('width') ||
        this.props.item.get('x') !== nextProps.item.get('x') || 
        this.props.item.get('y') !== nextProps.item.get('y')) {
      this._setStyle(nextProps)
    }
  }
  render() {
    let textItem = (
      <div className={this._getClassName()} 
           ref='textItem'
           style={this.state.style}>
        <div className='text-item-content' ref='textItemContent'>
          {this.props.item.get('content')}
        </div>
        <Metadata isShowingMetadata={this.props.isShowingMetadata} 
                  item={this.props.item} />
      </div>
    )
    if(this.props.item.get('linkedTo')) {
      textItem = (
        <Link to={'/' + this.props.item.get('linkedTo')} 
              onClick={this._handleClick}>
          {textItem}
        </Link>
      )
    }
    if (this.props.authData !== null && !this.props.authData.isEmpty()) {
      if (this.props.item.get('userId') === this.props.authData.get('uid')) {
        // This particular video belongs to the logged-in user.
        return (
          <DraggableCore cancel='.react-resizable-handle'
                         onDrag={this._handleDrag} 
                         onStop={this._handleDragStop} 
                         onMouseDown={this._handleMouseDown}>
            <Resizable height={this.state.height} 
                       onResize={this._handleResize}
                       onResizeStop={this._handleResizeStop}
                       width={this.state.width}>
              {textItem}
            </Resizable>
          </DraggableCore>
        )
      }
    }
    // Not logged in, or current user does not own video.
    return textItem
  }
}
