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
import TextItem from '../components/text/TextItem'
import VideoItem from '../components/video/VideoItem'

class FilterPage extends React.Component {
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
      this.props.pageClicked()
    }
  }
  componentDidMount() {
    this.props.listenToFilteredItems(this.props.appliedFilters)
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
    if (this.props.appliedFilters !== nextProps.appliedFilters) {
      this.setState({
        wasInitiallyScrolled: false
      })
      this.props.listenToFilteredItems(nextProps.appliedFilters)
    }
  }
  render() {
    const filteredItems = this.props.filteredItems.map((filteredItem, key) => {
      switch (filteredItem.get('type')) {
        case 'text':
          return <TextItem baseUrl={this.props.baseUrl}
                           deleteItem={this.props.deleteItem}
                           featuredItemId={this.props.featuredItemId}
                           hideMetadata={this.props.hideMetadata}
                           id={key} 
                           isInLinkingMode={this.props.isInLinkingMode}
                           isShowingMetadata={this.props.isShowingMetadata}
                           item={filteredItem} 
                           itemClicked={this.props.itemClicked}
                           key={key} 
                           setFeaturedItemId={this.props.setFeaturedItemId}
                           setTextItemRawState={this.props.setTextItemRawState} 
                           setItemMetadata={this.props.setItemMetadata}
                           user={this.props.user} />
        case 'video':
          return <VideoItem baseUrl={this.props.baseUrl}
                            deleteItem={this.props.deleteItem}
                            featuredItemId={this.props.featuredItemId}
                            halfway={this.props.halfway}
                            height={this.props.height}
                            hideMetadata={this.props.hideMetadata}
                            id={key}
                            isInLinkingMode={this.props.isInLinkingMode}
                            isShowingMetadata={this.props.isShowingMetadata}
                            item={filteredItem}
                            itemClicked={this.props.itemClicked}
                            key={key}
                            leftEdgeOfViewport={this.props.leftEdgeOfViewport}
                            paddingLeft={this.props.paddingLeft}
                            rightEdgeOfViewport={this.props.rightEdgeOfViewport}
                            setFeaturedItemId={this.props.setFeaturedItemId}
                            setItemMetadata={this.props.setItemMetadata}
                            user={this.props.user} />
        default:
          return null
      }
    }).toArray()
    return (
      <div className='page' 
           id='filter-page'
           style={this._getStyle()}>
        {filteredItems}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    appliedFilters: state.getIn(['filter', 'appliedFilters']),
    baseUrl: state.getIn(['page', 'baseUrl']),
    halfway: getHalfway(state),
    height: state.getIn(['page', 'height']),
    isInLinkingMode: state.getIn(['link', 'isInLinkingMode']),
    isShowingMetadata: state.getIn(['app', 'isShowingMetadata']),
    filteredItems: state.getIn(['filter', 'filteredItems']),
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
    deleteItem: bindActionCreators(actions.deleteItem, dispatch),
    hideMetadata: bindActionCreators(actions.hideMetadata, dispatch),
    itemClicked: bindActionCreators(actions.itemClicked, dispatch),
    listenToFilteredItems: bindActionCreators(actions.listenToFilteredItems, 
                                              dispatch),
    pageClicked: bindActionCreators(actions.pageClicked, dispatch),
    setFeaturedItemId: bindActionCreators(actions.setFeaturedItemId, dispatch),
    setItemMetadata: bindActionCreators(actions.setItemMetadata, dispatch),
    setTextItemRawState: bindActionCreators(actions.setTextItemRawState, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPage)
