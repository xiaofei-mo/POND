import React from 'react'
import { Link } from 'react-router'

export default class LoginUsernameLogoutControl extends React.Component {
  constructor() {
    super()
    this._handleLoginClick = this._handleLoginClick.bind(this)
    this._handleLogoutClick = this._handleLogoutClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleLoginClick(event) {
    event.preventDefault()
    this.props.openLogin()
  }
  _handleLogoutClick(event) {
    event.preventDefault()
    this.props.logout()
  }
  render() {
    if (this.props.authData === null) {
      return null
    }
    if (!this.props.authData.isEmpty()) {
      // A user is logged in. Are they on their personal page?
      const username = this.props.authData.get('username')
      const timingOrUsername = this.props.params.timingOrUsername
      if (username === timingOrUsername) {
        return <a className='login-username-logout-control app-control' 
                  href='#' 
                  onClick={this._handleLogoutClick}>Logout</a>
      }
      else {
        return <Link className='login-username-logout-control app-control' 
                     to={'/' + username}>{username}</Link>
      }
      label = <span>{this.props.authData.get('username')}</span>
    }
    return <a className='login-username-logout-control app-control' 
              href='#' 
              onClick={this._handleLoginClick}>Login</a>
  }
}
