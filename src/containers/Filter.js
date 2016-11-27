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
import Clear from '../components/filter/Clear'
import { connect } from 'react-redux'
import Draggable from 'react-draggable'
import OpenerCloser from '../components/filter/OpenerCloser'
import React from 'react'
import ReactDOM from 'react-dom'
import Vocabularies from '../components/filter/Vocabularies'

class Filter extends React.Component {
  constructor() {
    super()
    this.state = {
      height: 0,
      isVisible: false,
      width: 0
    }
    this._handleOpenClose = this._handleOpenClose.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  _handleOpenClose() {
    this.setState({
      isVisible: !this.state.isVisible
    })
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this)
    if (el !== null && this.state.height === 0 && this.state.width === 0) {
      this.setState({
        height: el.offsetHeight,
        width: el.offsetWidth
      })
    }
  }
  componentWillMount() {
    this.props.listenToVocabularies()
  }
  render() {
    if (this.props.windowHeight === 0 && this.props.windowWidth === 0) {
      return null
    }
    const bounds = {
      top: 0,
      right: this.props.windowWidth - this.state.width,
      bottom: this.props.windowHeight - this.state.height,
      left: 0
    }
    const defaultPosition = { x: 40, y: (this.props.windowHeight * 0.5) }
    return (
      <Draggable bounds={bounds} defaultPosition={defaultPosition}>
        <div className='filter'>
          <OpenerCloser isVisible={this.state.isVisible} 
                        onOpenClose={this._handleOpenClose} />
          <Vocabularies isVisible={this.state.isVisible}
                        toggleAppliedFilter={this.props.toggleAppliedFilter}
                        toggleVocabulary={this.props.toggleVocabulary}
                        vocabularies={this.props.vocabularies} />
          <Clear appliedFilters={this.props.appliedFilters}
                 clearAppliedFilters={this.props.clearAppliedFilters}
                 isVisible={this.state.isVisible} />
        </div>
      </Draggable>
    )
  }
}

function mapStateToProps (state) {
  return {
    appliedFilters: state.getIn(['filter', 'appliedFilters']),
    vocabularies: state.getIn(['filter', 'vocabularies']),
    windowHeight: state.getIn(['page', 'height']),
    windowWidth: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clearAppliedFilters: bindActionCreators(actions.clearAppliedFilters, 
                                            dispatch),
    listenToVocabularies: bindActionCreators(actions.listenToVocabularies, 
                                             dispatch),
    toggleAppliedFilter: bindActionCreators(actions.toggleAppliedFilter, 
                                            dispatch),
    toggleVocabulary: bindActionCreators(actions.toggleVocabulary, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
