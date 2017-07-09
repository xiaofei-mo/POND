import React from 'react';

export default class SigningUp extends React.Component {
  constructor () {
    super();
    this.render = this.render.bind(this);
  }
  render () {
    if (!this.props.isSigningUp) {
      return null;
    }
    return <span className='signing-up'>Signing up...</span>
  }
}