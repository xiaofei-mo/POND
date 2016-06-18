import React from 'react'

export default class Sort extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    console.log('sort click')
  }
  render() {
    return <a className='sort app-control' href='#' onClick={this._handleClick}>Sort</a>
  }
}
