/*
 * Copyright (C) 2017 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see 
 * <http://www.gnu.org/licenses/>.
 */

import actions from '../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Filter from './Filter'
import getPaddingLeft from '../selectors/getPaddingLeft'
import Link from './Link'
import Login from '../components/login/Login'
import MetadataControl from '../components/metadata/Control'
import React from 'react'

class App extends React.Component {
  constructor() {
    super()
    this._handleDroppedFiles = this._handleDroppedFiles.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this._handleWheel = this._handleWheel.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'app'
    if (!this.props.user.isEmpty()) {
      className += ' is-logged-in'
    }
    if (this.props.isInLinkingTransition) {
      className += ' is-in-linking-transition'
      if (this.props.isInLinkingTransitionStage2) {
        className += ' stage-2'
      }
    }
    return className
  }
  _handleDroppedFiles(files, rejFiles, event) {
    if (!this.props.user.isEmpty()) {
      const x = event.clientX + this.props.scrollLeft - this.props.paddingLeft
      this.props.handleDroppedFiles(
        files,
        x,
        event.clientY,
        this.props.user,
        this.props.pageId
      )
    }
  }
  _handleScroll(event) {
    // Prevent scrolling in linking transition mode.
    if (this.props.isInLinkingTransition) {
      event.preventDefault()
      return false
    }
    // We need to use currentTarget because that is the value that points to 
    // the overall App workspace, not other scrollable things (like an item's
    // metadata).
    this.props.handleScroll(event.currentTarget.scrollLeft)
  }
  _handleWheel(event) {
    // Prevent scrolling in linking transition mode.
    if (this.props.isInLinkingTransition) {
      event.preventDefault()
      return false
    }
    // We need to use `getElementById` here because the Dropzone component makes
    // it difficult to access its underlying <div> directly.
    const scroller = document.getElementById('scroller')
    const zoomRate = document.getElementsByTagName('body')[0].style.zoom || 1

    const scrollRange = scroller.scrollWidth - window.innerWidth / zoomRate
    let scrollTo = (scroller.scrollLeft + event.deltaY) % scrollRange
    if (scrollTo < 0) scrollTo += scrollRange

    scroller.scrollLeft = scrollTo
  }
  componentWillMount() {
    this.props.listenToAuth()
  }
  render() {
    return (
      <div className={this._getClassName()}>
        <Dropzone
          accept='video/*,audio/*,image/*'
          activeClassName='dropzone-active'
          className='dropzone'
          disableClick={true}
          id='scroller'
          multiple={false}
          onDrop={this._handleDroppedFiles}
          onScroll={this._handleScroll}
          onWheel={this._handleWheel}
          ref='scroller'
        >
          {this.props.children}
          <Login
            attemptLogin={this.props.attemptLogin}
            signUp={this.props.signUp}
            loginFailed={this.props.loginFailed}
            logout={this.props.logout}
            params={this.props.params}
            user={this.props.user}
            userIsLoaded={this.props.userIsLoaded}
            shouldResetPassword={this.props.shouldResetPassword}
            requestResetPassword={this.props.requestResetPassword}
            emailSent={this.props.emailSent}
            sendEmailFailed={this.props.sendEmailFailed}
            shouldSignUp={this.props.shouldSignUp}
            signedUp={this.props.signedUp}
            signUpFailed={this.props.signUpFailed}
            resetLogin={this.props.resetLogin}
          />
          <MetadataControl
            hideMetadata={this.props.hideMetadata}
            isShowingMetadata={this.props.isShowingMetadata}
            showMetadata={this.props.showMetadata}
            uploads={this.props.uploads}
            windowHeight={this.props.windowHeight}
            windowWidth={this.props.windowWidth}
          />
          <Filter />
          <Link />
          <div className='dropzone-veil veil'>
            <div>
              <div>Drop Video</div>
            </div>
          </div>
          <div className='linking-transition-veil veil'>
          </div>
        </Dropzone>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isInLinkingTransition: state.getIn(['link', 'isInLinkingTransition']),
    isInLinkingTransitionStage2: state.getIn(['link',
      'isInLinkingTransitionStage2']),
    isShowingMetadata: state.getIn(['app', 'isShowingMetadata']),
    loginFailed: state.getIn(['app', 'loginFailed']),
    shouldResetPassword: state.getIn(['app', 'shouldResetPassword']),
    sendEmailFailed: state.getIn(['app', 'sendEmailFailed']),
    emailSent: state.getIn(['app', 'emailSent']),
    shouldSignUp: state.getIn(['app', 'shouldSignUp']),
    signedUp: state.getIn(['app', 'signedUp']),
    signUpFailed: state.getIn(['app', 'signUpFailed']),
    paddingLeft: getPaddingLeft(state),
    pageId: state.getIn(['page', 'pageId']),
    scrollLeft: state.getIn(['page', 'scrollLeft']),
    uploads: state.getIn(['upload', 'uploads']),
    user: state.getIn(['app', 'user']),
    userIsLoaded: state.getIn(['app', 'userIsLoaded']),
    windowHeight: state.getIn(['page', 'height']),
    windowWidth: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetLogin: bindActionCreators(actions.resetLogin, dispatch),
    attemptLogin: bindActionCreators(actions.attemptLogin, dispatch),
    requestResetPassword: bindActionCreators(actions.requestResetPassword, dispatch),
    signUp: bindActionCreators(actions.signUp, dispatch),
    handleDroppedFiles: bindActionCreators(actions.handleDroppedFiles, dispatch),
    handleScroll: bindActionCreators(actions.handleScroll, dispatch),
    hideMetadata: bindActionCreators(actions.hideMetadata, dispatch),
    listenToAuth: bindActionCreators(actions.listenToAuth, dispatch),
    logout: bindActionCreators(actions.logout, dispatch),
    showMetadata: bindActionCreators(actions.showMetadata, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
