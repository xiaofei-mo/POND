/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'

export default class Term extends React.Component {
  constructor() {
    super()
    this.state = { 
      randomColor: '#' + Math.random().toString(16).slice(2, 8).toUpperCase(),
    }
    this._getClassName = this._getClassName.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._handleDragStart = this._handleDragStart.bind(this)
    this._handleMouseOut = this._handleMouseOut.bind(this)
    this._handleMouseOver = this._handleMouseOver.bind(this)
    this._highlight = this._highlight.bind(this)
    this._unHighlight = this._unHighlight.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'term'
    if (this.props.isApplied) {
      className += ' is-applied'
    }
    return className
  }
  _handleClick(event) {
    event.preventDefault()
    this.props.toggleAppliedFilter(this.props.slug, this.props.name)
  }
  _handleDragStart(event) {
    event.preventDefault()
  }
  _handleMouseOut(event) {
    if (!this.props.isApplied) {
      this._unHighlight()
    }
  }
  _handleMouseOver(event) {
    this._highlight()
  }
  _highlight() {
    this.setState({ 
      style: { 
        color: this.state.randomColor 
      } 
    })
  }
  _unHighlight() {
    this.setState({ 
      style: { 
        color: 'white' 
      } 
    })
  }
  componentWillMount() {
    if (this.props.isApplied) {
      this._highlight()
    }
    else {
      this._unHighlight()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isApplied) {
      this._highlight()
    }
    else {
      this._unHighlight()
    }
  }
  render() {
    return (
      <li className={this._getClassName()}>
        <a href='#' 
           onClick={this._handleClick} 
           onDragStart={this._handleDragStart}
           onMouseOut={this._handleMouseOut}
           onMouseOver={this._handleMouseOver}
           style={this.state.style}>{this.props.name}</a>
      </li>
    )
  }
}
