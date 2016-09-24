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
import Draggable from 'react-draggable'
import React from 'react'
import ReactDOM from 'react-dom'
import Term from '../components/sort/Term'
import Terms from '../components/sort/Terms'
import Vocabulary from '../components/sort/Vocabulary'

class Sort extends React.Component {
  constructor() {
    super()
    this.state = {
      height: 0,
      width: 0
    }
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
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
    const vocabularies = this.props.vocabularies.map((v) => {
      return <Vocabulary key={v.get('name')}
                         toggleVocabulary={this.props.toggleVocabulary} 
                         vocabulary={v} />
    }).toArray()
    const defaultPosition = { x: 40, y: (this.props.windowHeight * 0.75) }
    return (
      <Draggable bounds={bounds} defaultPosition={defaultPosition}>
        <div className='sort'>
          <ul className='vocabularies'>
            {vocabularies}
          </ul>
        </div>
      </Draggable>
    )
  }
}

function mapStateToProps (state) {
  return {
    vocabularies: state.getIn(['sort', 'vocabularies']),
    windowHeight: state.getIn(['page', 'height']),
    windowWidth: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    listenToVocabularies: bindActionCreators(actions.listenToVocabularies, 
                                             dispatch),
    toggleVocabulary: bindActionCreators(actions.toggleVocabulary, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort)
