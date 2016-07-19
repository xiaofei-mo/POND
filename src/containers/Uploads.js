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
import UploadItem from '../components/upload/UploadItem'

export default class Uploads extends React.Component {
  constructor() {
    super()
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  componentWillMount() {
    this.props.listenToUploads(this.props.authData.get('uid'));
  }
  render() {
    const items = this.props.uploads.map((upload, uploadId) => {
      return <UploadItem cancelUpload={this.props.cancelUpload} 
                         key={uploadId} 
                         saveUpload={this.props.saveUpload}
                         upload={upload}
                         uploadId={uploadId} />
    }).toArray()
    return (
      <div className='uploads'>
        <ul className='upload-items'>
          {items}
        </ul>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    uploads: state.getIn(['upload', 'uploads'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    cancelUpload: bindActionCreators(actions.cancelUpload, dispatch),
    listenToUploads: bindActionCreators(actions.listenToUploads, dispatch),
    saveUpload: bindActionCreators(actions.saveUpload, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploads)
