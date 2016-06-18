import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'src/actions'
import Dropzone from 'react-dropzone'
import Uploads from 'src/containers/Uploads'
import Login from 'src/components/Login'
import LoginUsernameLogoutControl from 'src/components/app-control/LoginUsernameLogoutControl'
import InfoMoreInfoControl from 'src/components/app-control/InfoMoreInfoControl'
import EditControl from 'src/components/app-control/EditControl'
import SortControl from 'src/components/app-control/SortControl'
import Sort from 'src/containers/Sort'

class App extends React.Component {
  constructor() {
    super()
    this._handleDroppedFiles = this._handleDroppedFiles.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this._handleWheel = this._handleWheel.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  _handleDroppedFiles(files) {
    this.props.handleDroppedFiles(files, this.props.authData)
  }
  _handleScroll(event) {
    this.props.handleScroll(event.target.scrollLeft)
  }
  _handleWheel(event) {
    // We need to use `getElementById` here because the Dropzone component makes
    // it difficult to access its underlying <div> directly.
    let scroller = document.getElementById('scroller')
    scroller.scrollLeft = scroller.scrollLeft + event.deltaY
  }
  componentWillMount() {
    this.props.listenToAuth()
  }
  render() {
    if (this.props.authData === null || this.props.authData.isEmpty()) {
      return (
        <div className='app'
             id='scroller'
             ref='scroller'
             onScroll={this._handleScroll}
             onWheel={this._handleWheel}>
          {this.props.children}
          <LoginUsernameLogoutControl authData={this.props.authData} 
                                      logout={this.props.logout}
                                      openLogin={this.props.openLogin} />
          <InfoMoreInfoControl isShowingInfo={this.props.isShowingInfo} 
                               showInfo={this.props.showInfo} />
          <SortControl />
          <Login attemptLogin={this.props.attemptLogin}
                 authData={this.props.authData} 
                 closeLogin={this.props.closeLogin}
                 login={this.props.login} />
          <Sort />
        </div>
      )
    }
    return (
      <div className='app'>
        <Dropzone accept='video/*'
                  activeClassName='dropzone-active'
                  className='dropzone' 
                  disableClick={true} 
                  id='scroller'
                  multiple={false} 
                  onDrop={this._handleDroppedFiles}
                  onScroll={this._handleScroll}
                  onWheel={this._handleWheel}
                  ref='scroller'>
          {this.props.children}
          <Uploads authData={this.props.authData} />
          <LoginUsernameLogoutControl authData={this.props.authData} 
                                      logout={this.props.logout}
                                      openLogin={this.props.openLogin} 
                                      params={this.props.params} />
          <InfoMoreInfoControl isShowingInfo={this.props.isShowingInfo} 
                               showInfo={this.props.showInfo} />
          <SortControl openSort={this.props.openSort} 
                       sortIsOpen={this.props.sortIsOpen} />
          <EditControl />
          <div className='dropzone-veil veil'>
            <div>
              <div>Drop Video</div>
            </div>
          </div>
          <Sort />
        </Dropzone>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    authData: state.getIn(['app', 'authData']),
    isShowingInfo: state.getIn(['app', 'isShowingInfo']),
    login: state.getIn(['app', 'login']),
    sortIsOpen: state.getIn(['sort', 'isOpen'])
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
    openLogin: bindActionCreators(actions.openLogin, dispatch),
    openSort: bindActionCreators(actions.openSort, dispatch),
    showInfo: bindActionCreators(actions.showInfo, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
