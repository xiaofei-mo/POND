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
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { Link } from 'react-router'
import ControlBar from '../metadata/ControlBar'
import React from 'react'
import { Resizable } from 'react-resizable'
import { stateToHTML } from 'draft-js-export-html'
import Unlink from '../link/Unlink'
import LinkStills from '../link/LinkStills'
import MultipleColumnText from './MultipleColumnText'
import Editor from './Editor'
import setHashBySeconds from '../../utils/setHashBySeconds'

export default class TextItem extends React.Component {
  constructor() {
    super()
    this.state = {
      editorIsFocused: false,
      editorState: EditorState.createEmpty(),
      content: '',
      height: 0,
      style: {
        // width: '0px',
        // height: '0px',
        transform: 'translate(0px, 0px)'
      },
      wasDragged: false,
      // width: 0,
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
    // this._handleResize = this._handleResize.bind(this)
    // this._handleResizeStop = this._handleResizeStop.bind(this)
    this._handleWheel = this._handleWheel.bind(this)
    this._handleChange = this._handleChange.bind(this)
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
    // if (this._shouldAllowDragAndResize()) {
    //   className += ' should-allow-drag-and-resize'
    // }
    if (this.props.navigationSource === this.props.item.get('id')) {
      className += ' navigation-source'
    }
    if (this.props.navigationDestination === this.props.item.get('id')) {
      className += ' navigation-destination'
    }
    return className
  }
  _handleClick(event) {
    if (this.state.wasDragged) {
      event.preventDefault()
      return false
    }
    else {
      // Not dragged.
      this.props.itemClicked(this.props.item)
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
        // height: this.state.style.height,
        // width: this.state.style.width,
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: true,
      // width: this.state.width,
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
        // this.refs.editor.focus()
        this.setState({
          editorIsFocused: true
        })
      }
    }
  }
  _handleEditorBlur(event) {
    this.props.setTextItemContent(
      this.props.item.get('id'),
      this.state.content
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
  _handleWheel(event) {
    event.stopPropagation()
  }
  _shouldAllowDragAndResize() {
    return this.props.user.get('uid') === this.props.item.get('userId') &&
      !this.props.isShowingMetadata &&
      !this.state.editorIsFocused
  }
  _handleChange(ev) {
    this.setState({
      content: ev.target.value
    })
  }
  _shouldSetHash(props) {
    const zoneLeft = props.item.get('x') + props.paddingLeft
    const zoneRight = props.item.get('x') +
      (props.item.get('width') || C.TEXT_ITEM_ROW_WIDTH) +
      props.paddingLeft
    if (props.halfway > zoneLeft && props.halfway < zoneRight) {
      return true
    }
    return false
  }
  _setHash() {
    const timing = this.props.item.get('timing')
    setHashBySeconds(timing)
  }
  componentWillReceiveProps(nextProps) {
    if (!this._shouldSetHash(this.props) && this._shouldSetHash(nextProps)) {
      this._setHash()
    }
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
    this.setState({
      content: this.props.item.get('content')
    })
    const x = this.props.item.get('x')
    const y = this.props.item.get('y')
    this.setState({
      height: this.props.item.get('height'),
      style: {
        // height: this.props.item.get('height') + 'px',
        // width: this.props.item.get('width') + 'px',
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: this.state.wasDragged,
      // width: this.props.item.get('width'),
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
      // const dangerousInnerHtml = {
      //   __html: stateToHTML(contentState)
      // }
      // content = <div className='dangerous'
      //   dangerouslySetInnerHTML={dangerousInnerHtml} />
      content = <MultipleColumnText value={this.state.content} />
    }
    if (!this.props.user.isEmpty() && this.props.item.get('userId') === this.props.user.get('uid')) {
      const editor =
        <Editor
          value={this.state.content}
          onChange={this._handleChange}
          onWheel={this._handleWheel}
          onBlur={this._handleEditorBlur}
        />
      const textView =
        <MultipleColumnText
          value={this.state.content}
          onClick={this._handleEditorFocus}
        />

      // content = <Editor editorState={this.state.editorState}
      //   onBlur={this._handleEditorBlur}
      //   onChange={this._handleEditorChange}
      //   onFocus={this._handleEditorFocus}
      //   ref='editor' />
      content = this.state.editorIsFocused ? editor : textView;
    }

    let linkStills = null;
    if (!this.state.editorIsFocused) linkStills = <LinkStills item={this.props.item} />

    return (
      <DraggableCore cancel='.react-resizable-handle'
        onDrag={this._handleDrag}
        onStop={this._handleDragStop}
        onMouseDown={this._handleMouseDown}>
        {/* <Resizable height={this.state.height}
          onClick={this._handleClick}
          onResize={this._handleResize}
          onResizeStop={this._handleResizeStop}
          width={this.state.width}> */}
        <div className={this._getClassName()}
          ref='textItem'
          style={this.state.style}
        >
          <div className='text-item-content'
            ref='textItemContent'>
            {content}
          </div>
          <ControlBar baseUrl={this.props.baseUrl}
            deleteItem={this.props.deleteItem}
            featuredItemId={this.props.featuredItemId}
            hideMetadata={this.props.hideMetadata}
            isShowingMetadata={this.props.isShowingMetadata}
            item={this.props.item}
            setFeaturedItemId={this.props.setFeaturedItemId}
            setItemMetadata={this.props.setItemMetadata}
            user={this.props.user} />
          <Unlink itemId={this.props.item.get('id')} />
          {linkStills}
        </div>
        {/* </Resizable> */}
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
