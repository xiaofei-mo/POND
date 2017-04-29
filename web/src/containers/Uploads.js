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
    if (!this.state.shouldPlaySound) {
      return null
    }
    return (
      <div className='uploads'>
        <audio src='static/upload_done.mp3' autoPlay />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    uploads: state.getIn(['upload', 'uploads']),
    user: state.getIn(['app', 'user'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    listenToUploads: bindActionCreators(actions.listenToUploads, dispatch),
    stopListeningToUploads: bindActionCreators(actions.stopListeningToUploads, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploads)
