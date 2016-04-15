import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'src/actions'
import Dropzone from 'react-dropzone'
import Uploads from 'src/containers/Uploads'
import Login from 'src/components/Login'
import LoginUsernameLogout from 'src/components/LoginUsernameLogout'

class App extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  componentWillMount() {
    this.props.listenToAuth()
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
          <Uploads />
          <LoginUsernameLogout authData={this.props.authData} 
                               logout={this.props.logout}
                               openLogin={this.props.openLogin} />
          <Login attemptLogin={this.props.attemptLogin}
                 authData={this.props.authData} 
                 closeLogin={this.props.closeLogin}
                 login={this.props.login} />
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
    authData: state.getIn(['app', 'authData']),
    login: state.getIn(['app', 'login'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    attemptLogin: bindActionCreators(actions.attemptLogin, dispatch),
    closeLogin: bindActionCreators(actions.closeLogin, dispatch),
    handleDroppedFiles: bindActionCreators(actions.handleDroppedFiles, dispatch),
    listenToAuth: bindActionCreators(actions.listenToAuth, dispatch),
    logout: bindActionCreators(actions.logout, dispatch),
    openLogin: bindActionCreators(actions.openLogin, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
