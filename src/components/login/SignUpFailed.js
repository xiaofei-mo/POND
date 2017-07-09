import React from 'react';

export default class SignUpFailed extends React.Component {
  constructor () {
    super();
    this.render = this.render.bind(this);
  }
  render () {
    if (!this.props.signUpFailed) {
      return null;
    }
    return (
      <div className='sign-up-failed error'>Invalid username</div>
    )
  }
}
