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

import { C } from '../../constants'
import { DraggableCore } from 'react-draggable'
import { convertFromRaw, convertToRaw, Editor, EditorState } from 'draft-js'
import { Link } from 'react-router'
import Metadata from '../shared/Metadata'
import React from 'react'
import { Resizable } from 'react-resizable'
import { stateToHTML } from 'draft-js-export-html'

export default class TextItem extends React.Component {
  constructor() {
    super()
    this.state = {
      editorIsFocused: false,
      editorState: EditorState.createEmpty(),
      height: 0,
      style: {
        width: '0px',
        height: '0px',
        transform: 'translate(0px, 0px)'
      },
      wasDragged: false,
      width: 0,
      x: 0,
      y: 0
    }
    this._getClassName = this._getClassName.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._handleDrag = this._handleDrag.bind(this)
    this._handleDragStop = this._handleDragStop.bind(this)
    this._handleEditorBlur = this._handleEditorBlur.bind(this)
    this._handleEditorChange = this._handleEditorChange.bind(this)
    this._handleEditorFocus = this._handleEditorFocus.bind(this)
    this._handleMouseDown = this._handleMouseDown.bind(this)
    this._handleResize = this._handleResize.bind(this)
    this._handleResizeStop = this._handleResizeStop.bind(this)
    this._handleWheel = this._handleWheel.bind(this)
    this._shouldAllowDragAndResize = this._shouldAllowDragAndResize.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    var className = 'text-item'
    if (this.props.isShowingMetadata) {
      className += ' is-showing-metadata'
    }
    if (this._shouldAllowDragAndResize()) {
      className += ' should-allow-drag-and-resize'
    }
    return className
  }
  _handleClick(event) {
    if (this.state.wasDragged) {
      event.preventDefault()
      return false
    }
  }
  _handleDrag(event, ui) {
    if (!this._shouldAllowDragAndResize()) {
      return false
    }
    const x = this.state.x + ui.deltaX
    let y = this.state.y + ui.deltaY
    const bottom = y + this.props.item.get('height')
    if (bottom > this.props.height) {
      y = this.props.height - this.props.item.get('height')
    }
    this.setState({
      height: this.state.height,
      style: {
        height: this.state.style.height,
        width: this.state.style.width,
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: true,
      width: this.state.width,
      x: x,
      y: y,
    })
  }
  _handleDragStop(event, ui) {
    if (this._shouldAllowDragAndResize()) {
      if (this.state.wasDragged) {
        this.props.setItemPosition(this.props.id, this.state.x, this.state.y)
      }
      else {
        this.refs.editor.focus()
        this.setState({
          editorIsFocused: true
        })
      }
    }
  }
  _handleEditorBlur(event) {
    const rawState = convertToRaw(this.state.editorState.getCurrentContent())
    this.props.setTextItemRawState(
      this.props.item.get('id'), 
      rawState
    )
    this.setState({
      editorIsFocused: false
    })
  }
  _handleEditorChange(editorState) {
    this.setState({
      editorState: editorState
    })
  }
  _handleEditorFocus(event) {
    this.setState({
      editorIsFocused: true
    })
  }
  _handleMouseDown(event) {
    if (!this.state.editorIsFocused) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (!this._shouldAllowDragAndResize()) {
      return false
    }
    let state = this.state
    state['wasDragged'] = false
    this.setState(state)
  }
  _handleResize(event, ui) {
    if (!this._shouldAllowDragAndResize()) {
      return false
    }
    let height = ui.size.height
    if (height < C.MINIMUM_ITEM_HEIGHT) {
      height = C.MINIMUM_ITEM_HEIGHT
    }
    let width = ui.size.width
    if (width < C.MINIMUM_ITEM_WIDTH) {
      width = C.MINIMUM_ITEM_WIDTH
    }
    this.setState({
      height: height,
      style: {
        height: height + 'px',
        width: width + 'px',
        transform: 'translate(' + this.state.x + 'px, ' + this.state.y + 'px)'
      },
      wasDragged: this.state.wasDragged,
      width: width,
      x: this.state.x,
      y: this.state.y
    })
  }
  _handleResizeStop(event, ui) {
    if(this._shouldAllowDragAndResize()) {
      this.props.setItemSize(this.props.id, this.state.height, this.state.width)
    }
  }
  _handleWheel(event) {
    event.stopPropagation()
  }
  _shouldAllowDragAndResize() {
    return this.props.user.get('uid') === this.props.item.get('userId') && 
           !this.props.isShowingMetadata &&
           !this.state.editorIsFocused
  }
  componentDidUpdate(prevProps) {
    if (this.props.item.get('isFocused', false)) {
      if (!prevProps.item.get('isFocused', false)) {
        if (this.refs.editor !== undefined) {
          this.refs.editor.focus()
        }
      }
    }
  }
  componentWillMount() {
    if (this.props.item.get('rawState') !== undefined) {
      const rawState = this.props.item.get('rawState').toJS()
      if (rawState.entityMap === undefined) {
        rawState.entityMap = {} // Thanks firebase
      }
      const contentState = convertFromRaw(rawState)
      this.setState({
        editorState: EditorState.createWithContent(contentState)
      })
    }
    else {
      this.setState({
        editorState: EditorState.createEmpty()
      })
    }
    const x = this.props.item.get('x')
    const y = this.props.item.get('y')
    this.setState({
      height: this.props.item.get('height'),
      style: {
        height: this.props.item.get('height') + 'px',
        width: this.props.item.get('width') + 'px',
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: this.state.wasDragged,
      width: this.props.item.get('width'),
      x: x,
      y: y
    })
  }
  render() {
    let content = <div></div>
    if (this.props.item.get('rawState') !== undefined) {
      const rawState = this.props.item.get('rawState').toJS()
      if (rawState.entityMap === undefined) {
        rawState.entityMap = {} // Thanks firebase
      }
      const contentState = convertFromRaw(rawState)
      const dangerousInnerHtml = {
        __html: stateToHTML(contentState)
      }
      content = <div className='dangerous' 
                     dangerouslySetInnerHTML={dangerousInnerHtml} />
    }
    if (!this.props.user.isEmpty()) {
      if (this.props.item.get('userId') === this.props.user.get('uid')) {
        content = <Editor editorState={this.state.editorState} 
                          onBlur={this._handleEditorBlur}
                          onChange={this._handleEditorChange} 
                          onFocus={this._handleEditorFocus} 
                          ref='editor' />
      }
    }
    let textItem = (
      <div className={this._getClassName()} 
           ref='textItem'
           style={this.state.style}>
        <div className='text-item-content' 
             onWheel={this._handleWheel}
             ref='textItemContent'>
          {content}
        </div>
        <Metadata deleteItem={this.props.deleteItem}
                  isShowingMetadata={this.props.isShowingMetadata} 
                  item={this.props.item} 
                  user={this.props.user} />
      </div>
    )
    if(this.props.item.get('linkedTo')) {
      textItem = (
        <Link to={'/' + this.props.item.get('linkedTo')} 
              onClick={this._handleClick}>
          {textItem}
        </Link>
      )
    }
    return (
      <DraggableCore cancel='.react-resizable-handle'
                     onDrag={this._handleDrag} 
                     onStop={this._handleDragStop} 
                     onMouseDown={this._handleMouseDown}>
        <Resizable height={this.state.height} 
                   onClick={this._handleClick}
                   onResize={this._handleResize}
                   onResizeStop={this._handleResizeStop}
                   width={this.state.width}>
          {textItem}
        </Resizable>
      </DraggableCore>
    )
  }
}

function findAncestorOffsetKey(node) {
  while (node && node !== document.documentElement) {
    var key = getSelectionOffsetKeyForNode(node);
    if (key != null) {
      return key;
    }
    node = node.parentNode;
  }
  return null;
}

function getSelectionOffsetKeyForNode(node) {
  return node instanceof Element ? node.getAttribute('data-offset-key') : null;
}
