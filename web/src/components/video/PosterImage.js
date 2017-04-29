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

import getCloudFrontUrl from '../../utils/getCloudFrontUrl'
import React from 'react'

export default class PosterImage extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    const sslUrl = this.props.item.getIn(['results', 'posterImage', 'ssl_url'])
    if (sslUrl === undefined) {
      return null
    }
    const backgroundImage = 'url(' + getCloudFrontUrl(sslUrl) + ')'
    const style = {
      backgroundImage: backgroundImage
    }
    return <div className='poster-image' style={style}></div>
  }
}
