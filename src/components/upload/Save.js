import React from 'react'

export default class Save extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    this.props.saveUpload(this.props.uploadId)
  }
  render() {
    if (this.props.upload.get('status') !== 'Done') {
      return null
    }
    return <a href className='save' onClick={this._handleClick}>Save</a>
  }
}
