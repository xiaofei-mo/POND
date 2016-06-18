import React from 'react'

export default class SortControl extends React.Component {
  constructor() {
    super()
    this._getClassName = this._getClassName.bind(this)
    this._handleMouseOver = this._handleMouseOver.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'sort-control app-control'
    if (this.props.sortIsOpen) {
      className += ' is-open'
    }
    return className
  }
  _handleMouseOver(event) {
    event.preventDefault()
    this.props.openSort()
  }
  render() {
    return <a className={this._getClassName()} 
              href='#' 
              onMouseOver={this._handleMouseOver}>Sort</a>
  }
}
