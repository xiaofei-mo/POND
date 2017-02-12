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

import { C } from '../../constants'
import getCloudFrontUrl from '../../utils/getCloudFrontUrl'
import PosterImage from './PosterImage'
import React from 'react'
import Video from 'react-html5video'

export default class SourceItem extends React.Component {
  constructor() {
    super()
    this._handleCanPlayThrough = this._handleCanPlayThrough.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.render = this.render.bind(this)
  }
  _handleCanPlayThrough(event) {
    // http://stackoverflow.com/questions/16137381/html5-video-element-request-stay-pending-forever-on-chrome
    event.target.play()
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.refs.video !== undefined) {
      // Fast-forward to the playback position of the clicked video.
      this.refs.video.seek(this.props.currentTime)
      // All link source video items are muted.
      this.refs.video.mute()
    }
  }
  render() {
    if (this.props.item === null) {
      return null
    }
    if (this.props.item.get('type') !== 'video') {
      return null
    }
    const style = {
      height: this.props.item.get('height') + 'px',
      left: this.props.left + 'px',
      top: this.props.top + 'px',
      width: this.props.item.get('width') + 'px'
    }
    return (
      <div className='video-item is-source-item'
           ref='item'
           style={style}>
        <Video loop 
               onCanPlayThrough={this._handleCanPlayThrough}
               ref='video'
        >
          <source src={getCloudFrontUrl(this.props.item.getIn(['results', 'encode', 'ssl_url']))} type='video/mp4' />
        </Video>
        <div className='obstructor'></div>
        <PosterImage item={this.props.item} />
      </div>
    )
  }
}
