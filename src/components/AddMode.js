import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

export default class AddMode extends React.Component {
  constructor() {
    super()
    this._handleDrop = this._handleDrop.bind(this)
    this.render = this.render.bind(this)
  }
  _handleDrop(files) {
    this.props.handleDroppedFile(files[0])
  }
  render() {
    if(!this.props.isInAddMode) {
      return null
    }
    return (
      <div className='add-mode'>
        <Dropzone className='dropzone' onDrop={this._handleDrop}>
          <div>
            <div>
              <div>Drop video</div>
            </div>
          </div>
        </Dropzone>
      </div>
    )
  }
}
