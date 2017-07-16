import getCloudFrontUrl from '../../utils/getCloudFrontUrl'
import React from 'react'

export default class Wavefrom extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    const sslUrl = this.props.item.getIn(['results', 'waveform', 'ssl_url'])
    if (sslUrl === undefined) {
      return null
    }
    const backgroundImage = 'url(' + getCloudFrontUrl(sslUrl) + ')'
    const style = {
      backgroundImage: backgroundImage
    }
    return <div className='waveform' style={style}></div>
  }
}
