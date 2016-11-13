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
import Vocabulary from './Vocabulary'

export default class Vocabularies extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    if (!this.props.isVisible) {
      return null
    }
    const vocabularies = this.props.vocabularies.map((v) => {
      return <Vocabulary key={v.get('name')}
                         toggleVocabulary={this.props.toggleVocabulary} 
                         vocabulary={v} />
    }).toArray()
    return (
      <ul className='vocabularies'>
        {vocabularies}
      </ul>
    )
  }
}
