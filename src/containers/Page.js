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

import actions from '../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getHalfway, getItems, getPaddingLeft, getPaddingRight, getScrollDestination } from '../selectors'
import Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import TextItem from '../components/text/TextItem'
import VideoItem from '../components/video/VideoItem'

class Page extends React.Component {
  constructor() {
    super()
    this._getClassName = this._getClassName.bind(this)
    this._getStyle = this._getStyle.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'page'
    if (this.props.params.timingOrUsername === undefined) {
      className += ' homepage'
    }
    return className
  }
  _getStyle() {
    let style = {
      paddingLeft: this.props.paddingLeft + 'px',
      paddingRight: this.props.paddingRight + 'px'
    }
    return style
  }
  _handleClick(event) {
    if (event.target === this.refs.page) {
      if (this.props.isShowingMetadata) {
        this.props.hideMetadata()
      }
      else if (event.metaKey && 
               this.props.authData !== null && 
               !this.props.authData.isEmpty()) {
        const x = event.clientX + this.props.scrollLeft - this.props.paddingLeft
        this.props.createTextItem(
          x, 
          event.clientY, 
          this.props.authData, 
          this.props.pageId
        )
      }
    }
  }
  componentDidMount() {
    this.props.listenToItems(this.props.params.timingOrUsername);
    this.scrollerNode = document.getElementById('scroller')
  }
  componentDidUpdate(prevProps, prevState) {
    const scrollAdjustment = prevProps.paddingLeft - this.props.paddingLeft
    if (prevProps.scrollDestination !== this.props.scrollDestination) {
      console.log('setting this.scrollerNode.scrollLeft = ', this.props.scrollDestination)
      this.scrollerNode.scrollLeft = this.props.scrollDestination
    }
    else if (scrollAdjustment !== 0) {
      console.log('adjusting this.scrollerNode.scrollLeft by ', scrollAdjustment)
      this.scrollerNode.scrollLeft -= scrollAdjustment
    }
  } 
  componentWillReceiveProps(nextProps) {
    if(this.props.params.timingOrUsername !== nextProps.params.timingOrUsername) {
      this.props.listenToItems(nextProps.params.timingOrUsername)
    }
  }
  render() {
    const items = this.props.items.map((item, key) => {
      switch (item.get('type')) {
        case 'text':
          return <TextItem authData={this.props.authData}
                           deleteItem={this.props.deleteItem}
                           id={key} 
                           isShowingMetadata={this.props.isShowingMetadata}
                           item={item} 
                           key={key} 
                           setItemPosition={this.props.setItemPosition} 
                           setItemSize={this.props.setItemSize}
                           setTextItemRawState={this.props.setTextItemRawState} />
        case 'video':
          return <VideoItem authData={this.props.authData}
                            deleteItem={this.props.deleteItem}
                            halfway={this.props.halfway}
                            height={this.props.height}
                            id={key}
                            isShowingMetadata={this.props.isShowingMetadata}
                            item={item}
                            key={key}
                            paddingLeft={this.props.paddingLeft}
                            setItemPosition={this.props.setItemPosition}
                            setItemSize={this.props.setItemSize} />
        default:
          return null
      }
    }).toArray()
    return (
      <div className={this._getClassName()} 
           id='page' 
           onClick={this._handleClick} 
           ref='page'
           style={this._getStyle()}
      >
        {items}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    authData: state.getIn(['app', 'authData']),
    halfway: getHalfway(state),
    height: state.getIn(['page', 'height']),
    isShowingMetadata: state.getIn(['app', 'isShowingMetadata']),
    items: getItems(state),
    paddingLeft: getPaddingLeft(state),
    paddingRight: getPaddingRight(state),
    pageId: state.getIn(['page', 'pageId']),
    scrollDestination: getScrollDestination(state),
    scrollLeft: state.getIn(['page', 'scrollLeft']),
    width: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createTextItem: bindActionCreators(actions.createTextItem, dispatch),
    deleteItem: bindActionCreators(actions.deleteItem, dispatch),
    hideMetadata: bindActionCreators(actions.hideMetadata, dispatch),
    listenToItems: bindActionCreators(actions.listenToItems, dispatch),
    setItemPosition: bindActionCreators(actions.setItemPosition, dispatch),
    setItemSize: bindActionCreators(actions.setItemSize, dispatch),
    setTextItemRawState: bindActionCreators(actions.setTextItemRawState, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
