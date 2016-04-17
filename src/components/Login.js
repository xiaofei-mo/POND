import React from 'react'

export default class Login extends React.Component {
  constructor() {
    super()
    this._handleCloserClick = this._handleCloserClick.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this.render = this.render.bind(this)
  }
  _handleCloserClick(event) {
    event.preventDefault()
    this.props.closeLogin()
  }
  _handleSubmit(event) {
    event.preventDefault()
    this.props.attemptLogin(this.refs.email.value, this.refs.password.value)
  }
  render() {
    if (!this.props.login.get('isOpen')) {
      return null
    }
    let failureMessage = null
    if (this.props.login.get('failed')) {
      failureMessage = <div className='error'>Login failed</div>
    }
    return (
      <div>
        <div className='login'>
          <a href='#' onClick={this._handleCloserClick} className='closer'>x</a>
          <form onSubmit={this._handleSubmit}>
            <div className='email-element'>
              <div>
                <label htmlFor='email'>Email</label>
                <input autoComplete='off' id='email' ref='email' type='text' />
              </div>
            </div>
            <div className='password-element'>
              <div>
                <label htmlFor='password'>Password</label>
                <input id='password' ref='password' type='password' />
              </div>
            </div>
            <div className='submit-element'>
              <input type='submit' value='Login' />
              {failureMessage}
            </div>
          </form>
        </div>
        <div className='login-veil veil'>
        </div>
      </div>
    )
  }
}
