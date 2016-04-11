import React from 'react'
import { connect } from 'react-redux'

class Login extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    return (
      <div id='login'>
        <form>
          <div>
            <label htmlFor='username'>Username</label>
            <input type='text' id='username' />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' />
          </div>
          <div>
            <input type='submit' value='Login' />
          </div>
        </form>
      </div>
    )
  }
}

export default connect()(Login)
