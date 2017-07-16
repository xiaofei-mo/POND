import React from 'react'

export default class CheckYourEmail extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    if (!this.props.emailSent) {
      return null
    }
    return (
      <span
        onClick={this.props.onRequestReset}
        className="sending-email"
      >
        Check your email
      </span>
    )
  }
}

