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

import { C } from '../../constants'
import { DraggableCore } from 'react-draggable'
import fadeIn from '../../utils/fadeIn'
import fadeOut from '../../utils/fadeOut'
import { Link } from 'react-router'
import Metadata from '../shared/Metadata'
import React from 'react'
import { Resizable } from 'react-resizable'
import Video from 'react-html5video'

export default class VideoItem extends React.Component {
  constructor() {
    super()
    this.state = {
      height: 0,
      style: {
        height: '0px',
        width: '0px',
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
    this._shouldBeMuted = this._shouldBeMuted.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    var className = 'video-item'
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
    if (this.props.authData.isEmpty() || this.props.isShowingMetadata) {
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
      y: y
    })
  }
  _handleDragStop(event, ui) {
    if (!this.props.authData.isEmpty()) {
      this.props.setItemPosition(this.props.id, this.state.x, this.state.y)
    }
  }
  _handleMouseDown(event) {
    if (this.props.authData.isEmpty() || this.props.isShowingMetadata) {
      return false
    }
    let state = this.state
    state['wasDragged'] = false
    this.setState(state)
  }
  _handleResize(event, ui) {
    if (ui.size.width < C.MINIMUM_ITEM_WIDTH) {
      return false
    }
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
    if (!this.props.authData.isEmpty()) {
      this.props.setItemSize(this.props.id, this.state.height, this.state.width)
    }
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
  _shouldBeMuted(props) {
    const zoneLeft = props.item.get('x') + props.paddingLeft
    const zoneRight = props.item.get('x') + props.item.get('width') + props.paddingLeft
    if (props.halfway > zoneLeft && props.halfway < zoneRight) {
      return false
    }
    return true
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
    if (this.props.isShowingMetadata !== nextProps.isShowingMetadata) {
      if (nextProps.isShowingMetadata) {
        this.refs.video.setVolume(0)
      }
      else {
        if (this._shouldBeMuted(nextProps)) {
          this.refs.video.setVolume(0)
        }
        else {
          this.refs.video.setVolume(1)
        }
      }
    }
    else if (this._shouldBeMuted(this.props) !== this._shouldBeMuted(nextProps)) {
      if (this._shouldBeMuted(nextProps)) {
        fadeOut((v) => {
          this.refs.video.setVolume(v)
        }, 3000, () => {
          this.refs.video.unmute()
        })
      }
      else if (!this._shouldBeMuted(nextProps)) {
        fadeIn((v) => {
          this.refs.video.setVolume(v)
        }, 3000, () => {
          this.refs.video.unmute()
        })
      }
    }
  }
  render() {
    let video = (
      <Video autoPlay 
             loop 
             muted
             poster={this.props.item.get('posterUrl')} 
             ref='video'
      >
        <source src={this.props.item.getIn(['results', 'encode', 'ssl_url'])} type='video/mp4' />
      </Video>
    )
    if(this.props.item.get('linkedTo')) {
      video = (
        <Link to={'/' + this.props.item.get('linkedTo')} onClick={this._handleClick}>
          {video}
        </Link>
      )
    }
    return (
      <DraggableCore cancel='.react-resizable-handle'
                     onDrag={this._handleDrag} 
                     onMouseDown={this._handleMouseDown} 
                     onStop={this._handleDragStop}>
        <Resizable height={this.state.height} 
                   lockAspectRatio={true}
                   onResize={this._handleResize}
                   onResizeStop={this._handleResizeStop}
                   width={this.state.width}>
            <div className={this._getClassName()} style={this.state.style}>
              {video}
              <Metadata authData={this.props.authData}
                        deleteItem={this.props.deleteItem}
                        isShowingMetadata={this.props.isShowingMetadata} 
                        item={this.props.item} />
            </div>
        </Resizable>
      </DraggableCore>
    )
  }
}
