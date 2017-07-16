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
import React from 'react'

import Email from './Email'
import { Link } from 'react-router'
import LoggingIn from './LoggingIn'
import LoginFailed from './LoginFailed'
import Logout from './Logout'
import Opener from './Opener'
import Password from './Password'
import ResetPassword from './ResetPassword'
import SendEmailFailed from './SendEmailFailed'
import SendingEmail from './SendingEmail'
import CheckYourEmail from './CheckYourEmail'
import Username from './Username'
import SigningUp from './SigningUp'
import SignUpFailed from './SignUpFailed'

const initialState = {
  email: '',
  isAcceptingEmail: false,
  isAcceptingPassword: false,
  isConfirmingLogout: false,
  isLoggingIn: false,
  isSigningUp: false,
  isResettingPassword: false,
  isSendingEmail: false,
  loginFailed: false,
  sendEmailFailed: false,
  signUpFailed: false,
  emailSent: false,
  isAcceptingUsername: false,
  password: '',
  username: ''
}

export default class Login extends React.Component {
  constructor() {
    super()
    this.state = initialState;

    this._handleOpenerClick = this._handleOpenerClick.bind(this)
    this._handlePasswordChange = this._handlePasswordChange.bind(this)
    this._handleUsernameChange = this._handleUsernameChange.bind(this)
    this._handlePasswordKeyUp = this._handlePasswordKeyUp.bind(this)
    this._handleUsernameKeyUp = this._handleUsernameKeyUp.bind(this)
    this._handleEmailChange = this._handleEmailChange.bind(this)
    this._handleEmailKeyUp = this._handleEmailKeyUp.bind(this)
    this._handleResetPasswordKeyUp = this._handleResetPasswordKeyUp.bind(this)
    this._onRequestReset = this._onRequestReset.bind(this)
    this._handleLogoutClick = this._handleLogoutClick.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _handleEmailChange(event) {
    this.setState({
      email: event.target.value
    })
  }
  _handleEmailKeyUp(event) {
    this.setState({
      loginFailed: false
    })
    switch (event.which) {
      case 13:
        event.preventDefault()
        // Don't do anything if we have an empty email field.
        if (this.state.email === '') {
          return
        }
        this.setState({
          isAcceptingEmail: false,
          isAcceptingPassword: true
        })
        break
      case 27:
        event.preventDefault()
        this._onRequestReset()
        break
    }
  }
  _handleResetPasswordKeyUp(event) {
    this.setState({
      loginFailed: false
    })
    switch (event.which) {
      case 13:
        event.preventDefault()
        // Don't do anything if we have an empty email field.
        if (this.state.email === '') {
          return
        }
        this.setState({
          isResettingPassword: false,
          sendEmailFailed: false,
          isSendingEmail: true,
        })
        this.props.requestResetPassword(this.state.email)
        break
      case 27:
        event.preventDefault()
        this._onRequestReset()
        break
    }

  }
  _handleLogoutClick(event) {
    event.preventDefault()
    this.props.logout()
  }

  _handleOpenerClick(event) {
    event.preventDefault()
    this.setState({
      isAcceptingEmail: true
    })
  }
  _handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }
  _handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    })
  }
  _handlePasswordKeyUp(event) {
    switch (event.which) {
      case 13:
        event.preventDefault()
        // Don't do anything if we have an empty password field.
        if (this.state.password === '') {
          return
        }
        this.setState({
          isAcceptingEmail: false,
          isAcceptingPassword: false,
          isLoggingIn: true
        })
        this.props.attemptLogin(this.state.email, this.state.password)
        break
      case 27:
        event.preventDefault()
        this.setState({
          email: '',
          isAcceptingPassword: false,
          password: ''
        })
        break
    }
  }
  _handleUsernameKeyUp(event) {
    this.setState({
      signUpFailed: false
    })
    switch (event.which) {
      case 13:
        event.preventDefault()
        if (this.state.username === '') {
          return
        }
        this.setState({
          isAcceptingUsername: false,
          isSigningUp: true
        })
        this.props.signUp(this.state.email, this.state.password, this.state.username);
        break
      case 27:
        event.preventDefault()
        this._onRequestReset()
        break
    }
  }
  _onRequestReset() {
    // Reset login status
    this.props.resetLogin()
    this.setState(initialState)
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.shouldResetPassword && nextProps.shouldResetPassword) {
      // Display reset password prompt.
      this.setState({
        email: '',
        isAcceptingEmail: false,
        isLoggingIn: false,
        loginFailed: true,
        isResettingPassword: true,
        password: ''
      })
    } else if (!this.props.shouldSignUp && nextProps.shouldSignUp) {
      // Display username prompt for signing up
      this.setState({
        isAcceptingUsername: true,
        isLoggingIn: false,
      })
    } else if (!this.props.loginFailed && nextProps.loginFailed) {
      // Reset component and display email prompt.
      this.setState({
        email: '',
        isAcceptingEmail: true,
        isLoggingIn: false,
        loginFailed: true,
        password: ''
      })
    }
    if (!this.props.signedUp && nextProps.signedUp) {
      // Login immediately after signed up
      this.setState({
        isSigningUp: false,
        isAcceptingEmail: false,
        isAcceptingPassword: false,
        isLoggingIn: true
      })
      this.props.attemptLogin(this.state.email, this.state.password)
    }
    if (!this.props.sendEmailFailed && nextProps.sendEmailFailed) {
      this.setState({
        sendEmailFailed: true,
        isSendingEmail: false,
        isResettingPassword: true,
      })
    }
    if (!this.props.signUpFailed && nextProps.signUpFailed) {
      this.setState({
        isSigningUp: false,
        isAcceptingUsername: true,
        signUpFailed: true,
      })
    }
    if (!this.props.emailSent && nextProps.emailSent) {
      this.setState({
        emailSent: true,
        isSendingEmail: false
      })
    }
    if (this.props.user.isEmpty() && !nextProps.user.isEmpty()) {
      // Reset component.
      this.setState({
        email: '',
        isAcceptingEmail: false,
        isAcceptingPassword: false,
        isConfirmingLogout: false,
        isLoggingIn: false,
        password: ''
      })
    }
  }
  render() {
    // Don't display anything if we haven't yet received any user info from
    // Firebase.
    if (!this.props.userIsLoaded) {
      return null
    }
    // A user is logged in.
    if (!this.props.user.isEmpty()) {
      // Is the user on her own page?
      const username = this.props.user.get('username')
      const timingOrUsername = this.props.params.timingOrUsername
      if (username === timingOrUsername) {
        // Yes -- display the logout prompt.
        return (
          <div className='login'>
            <Logout onClick={this._handleLogoutClick} username={username} />
          </div>
        )
      }
      // No -- display a link to the user's page.
      return (
        <div className='login'>
          <Link to={'/' + username}>{username}</Link>
        </div>
      )
    }
    // User is not logged in.
    return (
      <div className='login'>
        <LoggingIn
          isLoggingIn={this.state.isLoggingIn}
        />
        <SigningUp
          isSigningUp={this.state.isSigningUp}
        />
        <SendingEmail
          isSendingEmail={this.state.isSendingEmail}
        />
        <Opener
          isAcceptingEmail={this.state.isAcceptingEmail}
          isAcceptingPassword={this.state.isAcceptingPassword}
          isLoggingIn={this.state.isLoggingIn}
          isResettingPassword={this.state.isResettingPassword}
          isSendingEmail={this.state.isSendingEmail}
          emailSent={this.state.emailSent}
          isAcceptingUsername={this.state.isAcceptingUsername}
          onClick={this._handleOpenerClick}
          isSigningUp={this.state.isSigningUp}
        />
        <Email
          email={this.state.email}
          isAcceptingEmail={this.state.isAcceptingEmail}
          onChange={this._handleEmailChange}
          onKeyUp={this._handleEmailKeyUp}
        />
        <Password
          isAcceptingPassword={this.state.isAcceptingPassword}
          onChange={this._handlePasswordChange}
          onKeyUp={this._handlePasswordKeyUp}
          password={this.state.password}
        />
        <ResetPassword
          isResettingPassword={this.state.isResettingPassword}
          onChange={this._handleEmailChange}
          onKeyUp={this._handleResetPasswordKeyUp}
        />
        <CheckYourEmail
          emailSent={this.state.emailSent}
          onRequestReset={this._onRequestReset}
        />
        <Username
          username={this.state.username}
          isAcceptingUsername={this.state.isAcceptingUsername}
          onKeyUp={this._handleUsernameKeyUp}
          onChange={this._handleUsernameChange}
        />
        <SendEmailFailed sendEmailFailed={this.state.sendEmailFailed} />
        <LoginFailed loginFailed={this.state.loginFailed} />
        <SignUpFailed signUpFailed={this.state.signUpFailed} />
      </div>
    )
  }
}
