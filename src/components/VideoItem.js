import React from 'react'
import Video from 'react-html5video'
import { Link } from 'react-router'
import Draggable from 'react-draggable'

export default class VideoItem extends React.Component {
  constructor() {
    super()
    this._handleOnCanPlay = this._handleOnCanPlay.bind(this)
    this._handleOnStop = this._handleOnStop.bind(this)
    this.render = this.render.bind(this)
  }
  _handleOnCanPlay() {
    if (!this.props.item.get('isReadyToPlay')) {
      this.props.setVideoReadyToPlay(this.props.id);
    }
  }
  _handleOnStop(event, info) {
    this.props.setVideoPosition(this.props.id, info.position.left, info.position.top)
  }
  render() {
    let style = {
      width: this.props.item.get('width') + 'px',
      height: this.props.item.get('height') + 'px'
    }
    const video = (
      <Video key={this.props.key} 
             autoPlay 
             loop 
             muted 
             poster={this.props.item.get('posterUrl')} 
             onCanPlay={this._handleOnCanPlay}
      >
        <source src={this.props.item.get('mediaUrl')} type='video/mp4' />
      </Video>
    )
    if(this.props.item.get('linkedTo')) {
      return (
        <Draggable start={{ x: this.props.item.get('x'), y: this.props.item.get('y') }}  onStop={this._handleOnStop}>
          <div className="video-item" style={style}>
            <Link to={'/' + this.props.item.get('linkedTo')}>
              {video}
            </Link>
          </div>
        </Draggable>
      )
    }
    return (
      <Draggable start={{ x: this.props.item.get('x'), y: this.props.item.get('y') }} onStop={this._handleOnStop}>
        <div className="video-item" style={style}>
          {video}
        </div>
      </Draggable>
    )
  }
}
