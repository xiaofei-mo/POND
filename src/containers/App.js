import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'src/actions'
import Dropzone from 'react-dropzone'

class App extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    return (
      <Dropzone accept='video/*'
                activeClassName='dropzone-active' 
                className='dropzone' 
                disableClick={true} 
                multiple={false} 
                onDrop={this.props.handleDroppedFiles}
      >
        <div id='app' className='app'>
          {this.props.children}
        </div>
        <div className='dropzone-veil'>
          <div>
            Drop Video
          </div>
        </div>
      </Dropzone>
    )
  }
}

function mapStateToProps (state) {
  return {
    droppedFiles: state.getIn(['app', 'droppedFiles'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDroppedFiles: bindActionCreators(actions.handleDroppedFiles, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
