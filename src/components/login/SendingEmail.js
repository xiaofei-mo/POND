import React from 'react';

export default class SendingEmail extends React.Component {
  constructor () {
    super();
    this.render = this.render.bind(this);
  }
  render () {
    if (!this.props.isSendingEmail) {
      return null;
    }
    return <span className='sending-email'>Sending email...</span>
  }
}
