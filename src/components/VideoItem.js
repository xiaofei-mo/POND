import React from 'react'
import Video from 'react-html5video'

export default class VideoItem extends React.Component {
  constructor() {
    super()
    this._getClassName = this._getClassName.bind(this)
    this._handleOnCanPlay = this._handleOnCanPlay.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'video-item'
    if (this.props.item.get('isVisible')) {
      className += ' is-visible'
    }
    return className
  }
  _handleOnCanPlay() {
    if (!this.props.item.get('isVisible')) {
      this.props.setVideoReadyToPlay(this.props.id);
    }
  }
  render() {
    let style = {
      width: this.props.item.get('width') + 'px',
      height: this.props.item.get('height') + 'px',
      left: this.props.item.get('x') + 'px',
      top: this.props.item.get('y') + 'px'
    }
    return (
      <div className={this._getClassName()}>
        <Video key={this.props.key} 
               autoPlay 
               loop 
               muted 
               poster={this.props.item.get('posterUrl')} 
               style={style}
               onCanPlay={this._handleOnCanPlay}
        >
          <source src={this.props.item.get('mediaUrl')} type='video/mp4' />
        </Video>
      </div>
    )
  }
}
