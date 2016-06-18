import React from 'react'

export default class EditControl extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    console.log('edit click')
  }
  render() {
    return <a className='edit-control app-control' 
              href='#' 
              onClick={this._handleClick}>Edit</a>
  }
}
