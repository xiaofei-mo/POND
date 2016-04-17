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
    this._handleDroppedFiles = this._handleDroppedFiles.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  _handleDroppedFiles(files) {
    this.props.handleDroppedFiles(files, this.props.authData)
  }
  _handleScroll(event) {
    this.props.handleScroll(event.target.scrollLeft)
    // console.log('App._handleScroll, event.target.scrollLeft = ', event.target.scrollLeft)
  }
  // componentDidMount() {
  //   console.log('componentDidMount, this.refs.scroller = ', this.refs.scroller)
  //   // const scroller = document.getElementById('scroller')
  //   // console.log('scroller = ', scroller)
  //   // scroller.addEventListener('scroll', (event) => {
  //   //   console.log('scroll, event.target = ', event.target)
  //   // })
  // }
  componentWillMount() {
    this.props.listenToAuth()
  }
  render() {
    if (this.props.authData === null || this.props.authData.isEmpty()) {
      return (
        <div ref='scroller' id='scroller' className='app' onScroll={this._handleScroll}>
          {this.props.children}
          <LoginUsernameLogout authData={this.props.authData} 
                               logout={this.props.logout}
                               openLogin={this.props.openLogin} />
          <Login attemptLogin={this.props.attemptLogin}
                 authData={this.props.authData} 
                 closeLogin={this.props.closeLogin}
                 login={this.props.login} />
        </div>
      )
    }
    return (
      <div className='app'>
        <Dropzone ref='scroller'
                  id='scroller'
                  accept='video/*'
                  activeClassName='dropzone-active' 
                  className='dropzone' 
                  disableClick={true} 
                  multiple={false} 
                  onDrop={this._handleDroppedFiles}
                  onScroll={this._handleScroll}
        >
          {this.props.children}
          <Uploads authData={this.props.authData} />
          <LoginUsernameLogout authData={this.props.authData} 
                               logout={this.props.logout}
                               openLogin={this.props.openLogin} 
                               params={this.props.params} />
          <div className='dropzone-veil veil'>
            <div>
              Drop Video
            </div>
          </div>
        </Dropzone>
      </div>
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
    handleScroll: bindActionCreators(actions.handleScroll, dispatch),
    listenToAuth: bindActionCreators(actions.listenToAuth, dispatch),
    logout: bindActionCreators(actions.logout, dispatch),
    openLogin: bindActionCreators(actions.openLogin, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
