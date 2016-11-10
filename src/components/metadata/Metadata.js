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
import CopyUrl from './CopyUrl'

export default class Metadata extends React.Component {
  constructor() {
    super()
    this.state = {
      featuredItemId: null,
      componentMetadata: Immutable.Map()
    }
    this._handleWheel = this._handleWheel.bind(this)
    this._saveComponentMetadata = this._saveComponentMetadata.bind(this)
    this._updateFeaturedItemId = this._updateFeaturedItemId.bind(this)
    this._updateComponentMetadata = this._updateComponentMetadata.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _handleWheel(event) {
    event.stopPropagation()
  }
  _saveComponentMetadata() {
    let metadata = Immutable.Map()
    this.state.componentMetadata.forEach((value, key) => {
      value = value.trim()
      if (value === '') {
        value = null
      }
      metadata = metadata.set(key, value)
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
  _updateComponentMetadata(name, value) {
    this.setState({
      componentMetadata: this.state.componentMetadata.set(name, value)
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isShowingMetadata) {
      if (!this.state.componentMetadataAlreadySet) {
        let componentMetadata = Immutable.Map({
          title: '',
          year: ''
        })
        if (nextProps.item.get('metadata') !== undefined) {
          nextProps.item.get('metadata').forEach((value, key) => {
            componentMetadata = componentMetadata.set(key, value)
          })
        }
        this.setState({
          componentMetadata: componentMetadata,
          componentMetadataAlreadySet: true,
          featuredItemId: nextProps.featuredItemId
        })
      }
    }
    else {
      this.setState({
        componentMetadata: Immutable.Map(),
        componentMetadataAlreadySet: false,
        featuredItemId: nextProps.featuredItemId
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
    const _getMetadataItem = (label, name) => {
      return <MetadataItem hideMetadata={this.props.hideMetadata}
                           label={label}
                           componentMetadata={this.state.componentMetadata}
                           name={name}
                           saveComponentMetadata={this._saveComponentMetadata}
                           updateComponentMetadata={this._updateComponentMetadata} 
                           userIsOwner={userIsOwner} />
    }
    return (
      <form className='metadata' onWheel={this._handleWheel}>
        <ul>
          {_getMetadataItem('Title', 'title')}
          {_getMetadataItem('Year', 'year')}
          <Duration item={this.props.item} />
          <Featured featuredItemId={this.state.featuredItemId} 
                    item={this.props.item} 
                    updateFeaturedItemId={this._updateFeaturedItemId} 
                    userIsOwner={userIsOwner} />
          <CopyUrl baseUrl={this.props.baseUrl} item={this.props.item} />
        </ul>
        <div className='controls'>
          <SaveControl saveComponentMetadata={this._saveComponentMetadata}
                       userIsOwner={userIsOwner} />
          <DeleteControl deleteItem={this.props.deleteItem} 
                         item={this.props.item} 
                         userIsOwner={userIsOwner} />
        </div>
      </form>
    )
  }
}
