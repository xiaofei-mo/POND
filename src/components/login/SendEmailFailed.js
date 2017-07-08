import React from 'react';

export default class SendEmailFailed extends React.Component {
  constructor () {
    super();
    this.render = this.render.bind(this);
  }
  render () {
    if (!this.props.sendEmailFailed) {
      return null;
    }
    return (
      <div className='send-email-failed error'>Invalid email addr</div>
    )
  }
}
