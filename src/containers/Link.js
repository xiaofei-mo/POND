/*
 * Copyright (C) 2017 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see 
 * <http://www.gnu.org/licenses/>.
 */

import actions from '../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Control from '../components/link/Control'
import DestinationVideoItem from '../components/video/DestinationItem'
import Draggable from 'react-draggable'
import React from 'react'
import ReactDOM from 'react-dom'
import SourceVideoItem from '../components/video/SourceItem'

class Link extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    return (
      <div className='link'>
        <Control planeClicked={this.props.planeClicked}
                 user={this.props.user} 
                 windowHeight={this.props.windowHeight} 
                 windowWidth={this.props.windowWidth} />
        <DestinationVideoItem currentTime={this.props.destination.get('currentTime')}
                              item={this.props.destination.get('item')}
                              left={this.props.destination.get('left')}
                              top={this.props.destination.get('top')} />
        <SourceVideoItem currentTime={this.props.source.get('currentTime')}
                         item={this.props.source.get('item')}
                         left={this.props.source.get('left')}
                         top={this.props.source.get('top')} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    destination: state.getIn(['link', 'destination']),
    isInLinkingMode: state.getIn(['link', 'isInLinkingMode']),
    source: state.getIn(['link', 'source']),
    user: state.getIn(['app', 'user']),
    windowHeight: state.getIn(['page', 'height']),
    windowWidth: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    planeClicked: bindActionCreators(actions.planeClicked, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Link)
