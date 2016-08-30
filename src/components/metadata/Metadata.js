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

import DeleteControl from './DeleteControl'
import Duration from './Duration'
import Featured from './Featured'
import Immutable from 'immutable'
import MetadataItem from './MetadataItem'
import React from 'react'
import SaveControl from './SaveControl'
import Url from './Url'

export default class Metadata extends React.Component {
  constructor() {
    super()
    this.state = {
      featuredItemId: null,
      metadata: Immutable.Map()
    }
    this._handleWheel = this._handleWheel.bind(this)
    this._saveMetadata = this._saveMetadata.bind(this)
    this._updateFeaturedItemId = this._updateFeaturedItemId.bind(this)
    this._updateMetadata = this._updateMetadata.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _handleWheel(event) {
    event.stopPropagation()
  }
  _saveMetadata() {
    let metadata = Immutable.Map()
    this.state.metadata.forEach((value, key) => {
      if (key === 'title' || key === 'year') {
        value = value.trim()
        if (value === '') {
          value = null
        }
        metadata = metadata.set(key, value)
      }
      else {
        let unserializedValues = Immutable.fromJS(value.split(',').map((v) => {
          v = v.trim()
          if (v === '') {
            return null
          }
          return v
        }))
        metadata = metadata.set(key, unserializedValues)
      }
    })
    if (this.state.featuredItemId !== this.props.featuredItemId) {
      this.props.setFeaturedItemId(this.props.item.get('id'))
    }
    this.props.setItemMetadata(this.props.item.get('id'), metadata)
  }
  _updateFeaturedItemId(featuredItemId) {
    if (this.state.featuredItemId !== featuredItemId) {
      this.setState({
        featuredItemId: featuredItemId
      })
    }
    else {
      this.setState({
        featuredItemId: null
      })
    }
  }
  _updateMetadata(name, value) {
    this.setState({
      metadata: this.state.metadata.set(name, value)
    })
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.isShowingMetadata && nextProps.isShowingMetadata) {
      let metadata = Immutable.Map({
        color: '',
        concepts: '',
        forms: '',
        movement: '',
        rhythm: '',
        period: '',
        perspective: '',
        sensory: '',
        source: '',
        things: '',
        title: '',
        year: ''
      })
      if (nextProps.item.get('metadata') !== undefined) {
        nextProps.item.get('metadata').forEach((value, key) => {
          if (key === 'title' || key === 'year') {
            metadata = metadata.set(key, value)
          }
          else {
            metadata = metadata.set(key, value.toJS().join(', '))
          }
        })
      }
      this.setState({
        featuredItemId: nextProps.featuredItemId,
        metadata: metadata
      })
    }
    else {
      this.setState({
        featuredItemId: nextProps.featuredItemId,
        metadata: Immutable.Map()
      })
    }
  }
  render() {
    if (!this.props.isShowingMetadata) {
      return null
    }
    let userIsOwner = false
    if (!this.props.user.isEmpty() &&
        this.props.user.get('uid') === this.props.item.get('userId')) {
      userIsOwner = true
    }
    const _getMetadataItem = (label, name, tabIndex) => {
      return <MetadataItem hideMetadata={this.props.hideMetadata}
                           label={label}
                           metadata={this.state.metadata}
                           name={name}
                           saveMetadata={this._saveMetadata}
                           tabIndex={tabIndex}
                           updateMetadata={this._updateMetadata} 
                           userIsOwner={userIsOwner} />
    }
    return (
      <form className='metadata' onWheel={this._handleWheel}>
        <ul>
          <Url baseUrl={this.props.baseUrl} item={this.props.item} />
          {_getMetadataItem('Title', 'title', 1)}
          {_getMetadataItem('Year', 'year', 2)}
          {_getMetadataItem('Color', 'color', 3)}
          {_getMetadataItem('Concepts', 'concepts', 4)}
          <Duration item={this.props.item} />
          {_getMetadataItem('Forms', 'forms', 5)}
          {_getMetadataItem('Movement', 'movement', 6)}
          {_getMetadataItem('Rhythm', 'rhythm', 7)}
          {_getMetadataItem('Period', 'period', 8)}
          {_getMetadataItem('Perspective', 'perspective', 9)}
          {_getMetadataItem('Sensory', 'sensory', 10)}
          {_getMetadataItem('Source', 'source', 11)}
          {_getMetadataItem('Things', 'things', 12)}
          <Featured featuredItemId={this.state.featuredItemId} 
                    item={this.props.item} 
                    updateFeaturedItemId={this._updateFeaturedItemId} 
                    userIsOwner={userIsOwner} />
        </ul>
        <div className='controls'>
          <SaveControl saveMetadata={this._saveMetadata}
                       userIsOwner={userIsOwner} />
          <DeleteControl deleteItem={this.props.deleteItem} 
                         item={this.props.item} 
                         userIsOwner={userIsOwner} />
        </div>
      </form>
    )
  }
}
