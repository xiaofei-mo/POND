import React from 'react'

export default class Term extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    console.log('term ' + this.props.name + ' click')
  }
  render() {
    return (
      <li className='term'>
        <a href='#' onClick={this._handleClick}>{this.props.name}</a>
      </li>
    )
  }
}
