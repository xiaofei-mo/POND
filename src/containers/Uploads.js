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

import actions from '../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import VideoUploadItem from '../components/upload/VideoUploadItem'

class Uploads extends React.Component {
  constructor() {
    super()
    this.state = {
      shouldPlaySound: false
    }
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.shouldPlaySound) {
      this.setState({
        shouldPlaySound: false
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.user.isEmpty() && !nextProps.user.isEmpty()) {
      this.props.listenToUploads(nextProps.user.get('uid'));
    }
    else if (!this.props.user.isEmpty() && nextProps.user.isEmpty()) {
      this.props.stopListeningToUploads()
    }
    if (!this.props.uploads.isEmpty() && nextProps.uploads.isEmpty()) {
      this.setState({
        shouldPlaySound: true
      })
    }
  }
  render() {
    const audioToPlay = this.state.shouldPlaySound ?
      <audio src='static/upload_done.mp3' autoPlay /> :
      null;

    const videos = this.props.uploads.filter(upload => upload.get('type') === 'video');

    
    return (
      <div className='uploads'>
        {videos.entrySeq().map(seq => (
          <VideoUploadItem
            key={seq[0]}
            upload={seq[1]}
            uploadId={seq[0]}
            cancelUpload={this.props.cancelUpload}
          />
        ))}
        {audioToPlay}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    uploads: state.getIn(['upload', 'uploads']),
    user: state.getIn(['app', 'user'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    listenToUploads: bindActionCreators(actions.listenToUploads, dispatch),
    stopListeningToUploads: bindActionCreators(actions.stopListeningToUploads, dispatch),
    cancelUpload: bindActionCreators(actions.cancelUpload, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploads)
