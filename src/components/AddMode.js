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
    console.log('AddMode._handleDrop, files = ', files)
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
