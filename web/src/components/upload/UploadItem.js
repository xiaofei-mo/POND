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

import React from 'react'
import ProgressBar from './ProgressBar'
import Cancel from './Cancel'
import Save from './Save'
import Status from './Status'
import filesize from 'filesize'

export default class UploadItem extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    const size = filesize(this.props.upload.get('size'), {
      spacer: ''
    }).toLowerCase()
    return (
      <li className='upload-item'>
        <Cancel uploadId={this.props.uploadId} 
                cancelUpload={this.props.cancelUpload} />
        <ProgressBar percent={this.props.upload.get('percent')} />
        <div className="name">{this.props.upload.get('originalName')}</div>
        <div className="size">({size})</div>
        <Status upload={this.props.upload} />
        <Save upload={this.props.upload} 
              uploadId={this.props.uploadId} 
              saveUpload={this.props.saveUpload} />
      </li>
    )
  }
}
