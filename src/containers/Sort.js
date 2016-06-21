/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'src/actions'
import Vocabulary from 'src/components/sort/Vocabulary'
import Term from 'src/components/sort/Term'
import Terms from 'src/components/sort/Terms'

export default class Sort extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this._handleMouseLeave = this._handleMouseLeave.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    this.props.closeAllVocabularies()
  }
  _handleMouseLeave(event) {
    this.props.closeSort()
  }
  componentWillMount() {
    this.props.listenToVocabularies()
  }
  render() {
    if (!this.props.isOpen) {
      return null
    }
    const vocabularies = this.props.vocabularies.map((v) => {
      return <Vocabulary key={v.get('name')}
                         toggleVocabulary={this.props.toggleVocabulary} 
                         vocabulary={v} />
    }).toArray()
    return (
      <div className='sort' 
           onClick={this._handleClick} 
           onMouseLeave={this._handleMouseLeave}>
        <ul className='vocabularies'>
          {vocabularies}
        </ul>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isOpen: state.getIn(['sort', 'isOpen']),
    vocabularies: state.getIn(['sort', 'vocabularies'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    closeAllVocabularies: bindActionCreators(actions.closeAllVocabularies, 
                                             dispatch),
    closeSort: bindActionCreators(actions.closeSort, dispatch),
    listenToVocabularies: bindActionCreators(actions.listenToVocabularies, 
                                             dispatch),
    toggleVocabulary: bindActionCreators(actions.toggleVocabulary, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort)
