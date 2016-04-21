import React from 'react'
import Video from 'react-html5video'
import { Link } from 'react-router'
import { DraggableCore } from 'react-draggable'
import InfoEdit from 'src/components/InfoEdit'

class LinkLink extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    console.log('LinkLink click')
  }
  render() {
    return <a className='link-link' href='#' onClick={this._handleClick}>Link</a>
  }
}

class EditLink extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    this.props.editItem(this.props.id);
  }
  render() {
    return <a className='edit-link' href='#' onClick={this._handleClick}>Edit</a>
  }
}

export default class VideoItem extends React.Component {
  constructor() {
    super()
    this.state = {
      x: 0,
      y: 0,
      style: {
        width: '0px',
        height: '0px',
        transform: 'translate(0px, 0px)'
      },
      wasDragged: false
    }
    this._getClassName = this._getClassName.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._handleCanPlay = this._handleCanPlay.bind(this)
    this._handleDrag = this._handleDrag.bind(this)
    this._handleMouseDown = this._handleMouseDown.bind(this)
    this._handleStop = this._handleStop.bind(this)
    this._setStyle = this._setStyle.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    var className = 'video-item'
    if (this.props.item.get('mostRecentlyTouched')) {
      className += ' most-recently-touched'
    }
    return className
  }
  _handleClick(event) {
    if (this.state.wasDragged) {
      event.preventDefault()
    }
  }
  _handleCanPlay() {
    if (!this.props.item.get('isReadyToPlay')) {
      this.props.setVideoReadyToPlay(this.props.id);
    }
  }
  _handleDrag(event, ui) {
    const x = this.state.x + ui.position.deltaX
    const y = this.state.y + ui.position.deltaY
    this.setState({
      x: x,
      y: y,
      style: {
        width: this.state.style.width,
        height: this.state.style.height,
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: true
    })
  }
  _handleMouseDown(event) {
    this.props.setMostRecentlyTouched(this.props.id)
    let state = this.state
    state['wasDragged'] = false
    this.setState(state)
  }
  _handleStop(event, ui) {
    this.props.setVideoPosition(this.props.id, this.state.x, this.state.y)
  }
  _setStyle(props) {
    const x = props.item.get('x')
    const y = props.item.get('y')
    this.setState({
      x: x,
      y: y,
      style: {
        width: props.item.get('width') + 'px',
        height: props.item.get('height') + 'px',
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      }
    })
  }
  componentWillMount() {
    this._setStyle(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.item.get('x') !== nextProps.item.get('x') || this.props.item.get('y') !== nextProps.item.get('y')) {
      this._setStyle(nextProps)
    }
  }
  render() {
    let muted = this.props.item.get('isMuted', false)
    if (this.props.isShowingInfo) {
      muted = true
    }
    let video = (
      <Video key={this.props.key} 
             autoPlay 
             loop 
             muted={muted}
             poster={this.props.item.get('posterUrl')} 
             onCanPlay={this._handleCanPlay}
      >
        <source src={this.props.item.getIn(['results', 'encode', 'ssl_url'])} type='video/mp4' />
      </Video>
    )
    if(this.props.item.get('linkedTo')) {
      video = (
        <Link to={'/' + this.props.item.get('linkedTo')} onClick={this._handleClick}>
          {video}
        </Link>
      )
    }
    return (
      <DraggableCore onDrag={this._handleDrag} onStop={this._handleStop} onMouseDown={this._handleMouseDown}>
        <div className={this._getClassName()} style={this.state.style}>
          {video}
          <InfoEdit isShowingInfo={this.props.isShowingInfo} 
                    item={this.props.item} />
          <div className="controls">
            <LinkLink />
            <EditLink id={this.props.id} editItem={this.props.editItem} />
          </div>
        </div>
      </DraggableCore>
    )
  }
}
