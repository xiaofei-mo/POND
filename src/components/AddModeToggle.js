import React from 'react'
import { connect } from 'react-redux'

export default class AddModeToggle extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    if (this.props.isInAddMode) {
      this.props.exitAddMode()
    }
    else {
      this.props.enterAddMode()
    }
  }
  render() {
    if(this.props.isInAddMode) {
      return <a href="#" className="add-mode-toggle" onClick={this._handleClick}>x</a>
    }
    return <a href="#" className="add-mode-toggle" onClick={this._handleClick}>+</a>
  }
}
