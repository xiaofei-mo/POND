import React from 'react'

export default class Cancel extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    this.props.cancelUpload(this.props.uploadId)
  }
  render() {
    return <a href='#' className='cancel' onClick={this._handleClick}>x</a>
  }
}
