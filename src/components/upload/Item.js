import React from 'react'
import ProgressBar from 'src/components/upload/ProgressBar'
import Cancel from 'src/components/upload/Cancel'
import Save from 'src/components/upload/Save'
import Status from 'src/components/upload/Status'
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
