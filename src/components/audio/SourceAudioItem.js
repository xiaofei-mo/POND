import getCloudFrontUrl from '../../utils/getCloudFrontUrl'
import Waveform from './Waveform'
import React from 'react'

export default class SourceAudioItem extends React.Component {
  constructor() {
    super()
    // this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.render = this.render.bind(this)
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (this.refs.video !== undefined) {
  //     // Fast-forward to the playback position of the clicked video.
  //     this.refs.video.seek(this.props.currentTime)
  //   }
  // }
  render() {
    if (this.props.item === null) {
      return null
    }
    if (this.props.item.get('type') !== 'audio') {
      return null
    }
    const style = {
      height: this.props.item.get('height') + 'px',
      left: this.props.left + 'px',
      top: this.props.top + 'px',
      width: this.props.item.get('width') + 'px'
    }
    return (
      <div className='audio-item is-source-item'
        style={style}>
        <div className='obstructor'></div>
        <Waveform item={this.props.item} />
      </div>
    )
  }
}
