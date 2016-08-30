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
import getHalfway from '../selectors/getHalfway'
import getLeftEdgeOfViewport from '../selectors/getLeftEdgeOfViewport'
import getPaddingLeft from '../selectors/getPaddingLeft'
import getPaddingRight from '../selectors/getPaddingRight'
import getRightEdgeOfViewport from '../selectors/getRightEdgeOfViewport'
import getScrollDestination from '../selectors/getScrollDestination'
import Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import TextItem from '../components/text/TextItem'
import VideoItem from '../components/video/VideoItem'

class Page extends React.Component {
  constructor() {
    super()
    this.state = {
      wasInitiallyScrolled: false
    }
    this._getStyle = this._getStyle.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
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
      else if (event.metaKey && !this.props.user.isEmpty()) {
        const x = event.clientX + this.props.scrollLeft - this.props.paddingLeft
        this.props.createTextItem(
          x, 
          event.clientY, 
          this.props.user, 
          this.props.pageId
        )
      }
    }
  }
  componentDidMount() {
    this.props.listenToFeaturedTiming()
    this.props.listenToItems(this.props.params.timingOrUsername)
    this.scrollerNode = document.getElementById('scroller')
  }
  componentDidUpdate(prevProps, prevState) {
    const scrollAdjustment = prevProps.paddingLeft - this.props.paddingLeft
    if (!this.state.wasInitiallyScrolled && 
        prevProps.scrollDestination !== this.props.scrollDestination) {
      this.scrollerNode.scrollLeft = this.props.scrollDestination
      this.setState({
        wasInitiallyScrolled: true
      })
    }
    else if (scrollAdjustment !== 0) {
      this.scrollerNode.scrollLeft -= scrollAdjustment
    }
  } 
  componentWillReceiveProps(nextProps) {
    if(this.props.params.timingOrUsername !== nextProps.params.timingOrUsername) {
      this.setState({
        wasInitiallyScrolled: false
      })
      this.props.listenToItems(nextProps.params.timingOrUsername)
    }
  }
  render() {
    const items = this.props.items.map((item, key) => {
      switch (item.get('type')) {
        case 'text':
          return <TextItem deleteItem={this.props.deleteItem}
                           featuredTiming={this.props.featuredTiming}
                           id={key} 
                           isShowingMetadata={this.props.isShowingMetadata}
                           item={item} 
                           key={key} 
                           setFeaturedTiming={this.props.setFeaturedTiming}
                           setItemPosition={this.props.setItemPosition} 
                           setItemSize={this.props.setItemSize}
                           setTextItemRawState={this.props.setTextItemRawState} 
                           user={this.props.user} />
        case 'video':
          return <VideoItem deleteItem={this.props.deleteItem}
                            featuredTiming={this.props.featuredTiming}
                            halfway={this.props.halfway}
                            height={this.props.height}
                            id={key}
                            isShowingMetadata={this.props.isShowingMetadata}
                            item={item}
                            key={key}
                            leftEdgeOfViewport={this.props.leftEdgeOfViewport}
                            paddingLeft={this.props.paddingLeft}
                            rightEdgeOfViewport={this.props.rightEdgeOfViewport}
                            setFeaturedTiming={this.props.setFeaturedTiming}
                            setItemPosition={this.props.setItemPosition}
                            setItemSize={this.props.setItemSize} 
                            user={this.props.user} />
        default:
          return null
      }
    }).toArray()
    return (
      <div className='page' 
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
    halfway: getHalfway(state),
    height: state.getIn(['page', 'height']),
    featuredTiming: state.getIn(['page', 'featuredTiming']),
    isShowingMetadata: state.getIn(['app', 'isShowingMetadata']),
    items: state.getIn(['page', 'items']),
    leftEdgeOfViewport: getLeftEdgeOfViewport(state),
    paddingLeft: getPaddingLeft(state),
    paddingRight: getPaddingRight(state),
    pageId: state.getIn(['page', 'pageId']),
    rightEdgeOfViewport: getRightEdgeOfViewport(state),
    scrollDestination: getScrollDestination(state),
    scrollLeft: state.getIn(['page', 'scrollLeft']),
    user: state.getIn(['app', 'user']),
    width: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createTextItem: bindActionCreators(actions.createTextItem, dispatch),
    deleteItem: bindActionCreators(actions.deleteItem, dispatch),
    hideMetadata: bindActionCreators(actions.hideMetadata, dispatch),
    listenToFeaturedTiming: bindActionCreators(actions.listenToFeaturedTiming, dispatch),
    listenToItems: bindActionCreators(actions.listenToItems, dispatch),
    setFeaturedTiming: bindActionCreators(actions.setFeaturedTiming, dispatch),
    setItemPosition: bindActionCreators(actions.setItemPosition, dispatch),
    setItemSize: bindActionCreators(actions.setItemSize, dispatch),
    setTextItemRawState: bindActionCreators(actions.setTextItemRawState, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
