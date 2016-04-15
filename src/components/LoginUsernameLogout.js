import React from 'react'

export default class LoginUsernameLogout extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    if (!this.props.authData.isEmpty()) {
      this.props.logout()
    }
    else {
      this.props.openLogin()
    }
  }
  render() {
    if (this.props.authData === null) {
      return null
    }
    let label = <span>Login</span>
    if (!this.props.authData.isEmpty()) {
      label = <span>{this.props.authData.get('username')}</span>
    }
    return <a className='login-username-logout' 
              href='#' 
              onClick={this._handleClick}>{label}</a>
  }
}
