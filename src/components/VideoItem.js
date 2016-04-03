import React from 'react'
import Video from 'react-html5video'
import { Link } from 'react-router'

export default class VideoItem extends React.Component {
  constructor() {
    super()
    this._getClassName = this._getClassName.bind(this)
    this._handleOnCanPlay = this._handleOnCanPlay.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'video-item'
    if (this.props.item.get('isReadyToPlay')) {
      className += ' is-ready-to-play'
    }
    return className
  }
  _handleOnCanPlay() {
    if (!this.props.item.get('isReadyToPlay')) {
      this.props.setVideoReadyToPlay(this.props.id);
    }
  }
  render() {
    let style = {
      width: this.props.item.get('width') + 'px',
      height: this.props.item.get('height') + 'px',
      transform: 'translate(' + this.props.item.get('x') + 'px, ' + this.props.item.get('y') + 'px)'
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
        <div className={this._getClassName()} style={style}>
          <Link to={'/' + this.props.item.get('linkedTo')}>
            {video}
          </Link>
        </div>
      )
    }
    return (
      <div className={this._getClassName()} style={style}>
        {video}
      </div>
    )
  }
}
