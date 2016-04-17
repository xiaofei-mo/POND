import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'src/actions'

class ProgressBar extends React.Component {
  constructor() {
    super()
    this._getStyle = this._getStyle.bind(this)
    this.render = this.render.bind(this)
  }
  _getStyle() {
    let percent = this.props.percent;
    if (percent < 0) {
      percent = 0
    }
    else if (percent > 100) {
      percent = 100
    }
    return {
      width: percent + '%'
    }
  }
  render() {
    return (
      <div className='progress-bar'>
        <div className='progress' style={this._getStyle()}></div>
      </div>
    )
  }
}

class Cancel extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    this.props.cancelUpload(this.props.uploadId)
  }
  render() {
    return <a href='#' className='cancel' onClick={this._handleClick}>x</a>
  }
}

class Save extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    this.props.saveUpload(this.props.uploadId)
  }
  render() {
    if (this.props.upload.get('status') !== 'done') {
      return null
    }
    return <input type='submit' className='save' value='Save' onClick={this._handleClick} />
  }
}

class UploadItem extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    return (
      <li className='upload-item'>
        <form>
          <div className='fields'>
          </div>
          <ProgressBar percent={this.props.upload.get('percent')} />
          <div className='name-status'>
            <div className='name-mime'>
              <span className='name'>{this.props.upload.get('originalName')}</span>
              <span className='mime'>({this.props.upload.get('originalType').replace(/video\//, '')})</span>
            </div>
            <div className='status'>{this.props.upload.get('status')}</div>
          </div>
          <div className='cancel-save'>
            <Cancel uploadId={this.props.uploadId} 
                    cancelUpload={this.props.cancelUpload} />
            <Save upload={this.props.upload} 
                  uploadId={this.props.uploadId} 
                  saveUpload={this.props.saveUpload} />
          </div>
        </form>
      </li>
    )
  }
}

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
    const uploadItems = this.props.uploads.map((upload, uploadId) => {
      return <UploadItem key={uploadId} 
                         upload={upload}
                         uploadId={uploadId} 
                         cancelUpload={this.props.cancelUpload} 
                         saveUpload={this.props.saveUpload} />
    }).toArray()
    return (
      <div className='uploads'>
        <ul className='upload-items'>
          {uploadItems}
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
