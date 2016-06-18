import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'src/actions'
import UploadItem from 'src/components/upload/UploadItem'

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
