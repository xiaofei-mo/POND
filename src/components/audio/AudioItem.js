import { C } from '../../constants';
import { DraggableCore } from 'react-draggable';
import fadeIn from '../../utils/fadeIn';
import fadeOut from '../../utils/fadeOut';
import getCloudFrontUrl from '../../utils/getCloudFrontUrl';
import Metadata from '../metadata/Metadata';
import Waveform from './Waveform';
import React from 'react';
import { Resizable } from 'react-resizable';
import Unlink from '../link/Unlink';
import LinkStills from '../link/LinkStills';

export default class AudioItem extends React.Component {
  constructor() {
    super()
    this.state = {
      height: 0,
      posterImageStyle: {},
      shouldBeRendered: false,
      style: {
        height: '0px',
        width: '0px',
        transform: 'translate(0px, 0px)'
      },
      wasDragged: false,
      width: 0,
      x: 0,
      y: 0
    }
    this.isFadingIn = false
    this.isFadingOut = false
    this._getClassName = this._getClassName.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._handleDrag = this._handleDrag.bind(this)
    this._handleDragStop = this._handleDragStop.bind(this)
    this._handleCanPlayThrough = this._handleCanPlayThrough.bind(this)
    this._handleMouseDown = this._handleMouseDown.bind(this)
    this._handleResize = this._handleResize.bind(this)
    this._handleResizeStop = this._handleResizeStop.bind(this)
    this._load = this._load.bind(this)
    this._setVolume = this._setVolume.bind(this)
    this._shouldAllowDragAndResize = this._shouldAllowDragAndResize.bind(this)
    this._shouldBeMuted = this._shouldBeMuted.bind(this)
    this._shouldBeRendered = this._shouldBeRendered.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.componentWillUnmount = this.componentWillUnmount.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'audio-item'
    if (this.props.isShowingMetadata) {
      className += ' is-showing-metadata'
    }
    if (this._shouldAllowDragAndResize()) {
      className += ' should-allow-drag-and-resize'
    }
    if (!this.state.shouldBeRendered) {
      className += ' should-show-placeholder'
    }
    else if (this.audioRef && this.audioRef.readyState < 4) {
      className += ' should-show-placeholder'
    }
    if (this.props.navigationSource === this.props.item.get('id')) {
      className += ' navigation-source'
    }
    if (this.props.navigationDestination === this.props.item.get('id')) {
      className += ' navigation-destination'
    }
    return className
  }
  _handleClick(event) {
    if (this.state.wasDragged) {
      event.preventDefault()
    }
    else {
      // Get the BCR so we can fix the source video item's position correctly.
      const bcr = this.refs.item.getBoundingClientRect()
      // Also, let's start the source video item at the clicked video's current
      // time.
      const currentTime = this.audioRef.currentTime
      this.props.itemClicked(this.props.item, bcr.left, bcr.top, currentTime)
    }
  }
  _handleDrag(event, ui) {
    if (!this._shouldAllowDragAndResize()) {
      return false
    }
    const x = this.state.x + ui.deltaX
    let y = this.state.y + ui.deltaY
    const bottom = y + this.props.item.get('height')
    if (bottom > this.props.height) {
      y = this.props.height - this.props.item.get('height')
    }
    this.setState({
      height: this.state.height,
      posterImageStyle: this.state.posterImageStyle,
      shouldBeRendered: this.state.shouldBeRendered,
      style: {
        height: this.state.style.height,
        width: this.state.style.width,
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: true,
      width: this.state.width,
      x: x,
      y: y
    })
  }
  _handleDragStop(event, ui) {
    if (this._shouldAllowDragAndResize()) {
      this.props.setItemPosition(this.props.id, this.state.x, this.state.y)
    }
  }
  _handleCanPlayThrough(event) {
    event.target.play()
  }
  _handleMouseDown(event) {
    if (!this._shouldAllowDragAndResize()) {
      return false
    }
    let state = this.state
    state['wasDragged'] = false
    this.setState(state)
  }
  _handleResize(event, ui) {
    if (!this._shouldAllowDragAndResize()) {
      return false
    }
    if (ui.size.width < C.MINIMUM_ITEM_WIDTH) {
      return false
    }
    this.setState({
      height: ui.size.height,
      posterImageStyle: this.state.posterImageStyle,
      shouldBeRendered: this.state.shouldBeRendered,
      style: {
        height: ui.size.height + 'px',
        width: ui.size.width + 'px',
        transform: 'translate(' + this.state.x + 'px, ' + this.state.y + 'px)'
      },
      wasDragged: this.state.wasDragged,
      width: ui.size.width,
      x: this.state.x,
      y: this.state.y
    })
  }
  _handleResizeStop(event, ui) {
    if (this._shouldAllowDragAndResize()) {
      this.props.setItemSize(this.props.id, this.state.height, this.state.width)
    }
  }
  _load() {
    if (this.audioRef) {
      this.audioRef.load()
    }
  }
  _setVolume(v) {
    if (this.audioRef) {
      this.audioRef.volume = v
    }
  }
  _shouldAllowDragAndResize() {
    if (this.props.setItemPosition === undefined ||
      this.props.setItemSize === undefined) {
      return false
    }
    return this.props.user.get('uid') === this.props.item.get('userId') &&
      !this.props.isShowingMetadata
  }
  _shouldBeMuted(props) {
    const zoneLeft = props.item.get('x') + props.paddingLeft
    const zoneRight = props.item.get('x') + props.item.get('width') + props.paddingLeft
    if (props.halfway > zoneLeft && props.halfway < zoneRight) {
      return false
    }
    return true
  }
  _shouldBeRendered(props) {
    const zoneLeft = props.item.get('x') + props.paddingLeft
    const zoneRight = props.item.get('x') + props.item.get('width') + props.paddingLeft
    const zoneLeftIsInViewport = zoneLeft > props.leftEdgeOfViewport && zoneLeft < props.rightEdgeOfViewport
    const zoneRightIsInViewport = zoneRight > props.leftEdgeOfViewport && zoneRight < props.rightEdgeOfViewport
    return zoneLeftIsInViewport || zoneRightIsInViewport
  }
  componentDidMount() {
    this._setVolume(0)
    this._load()
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.shouldBeRendered && this.state.shouldBeRendered) {
      this._setVolume(0)
      this._load()
      if (this.savedTime) {
        this.audioRef.currentTime = this.savedTime
      }
    }
  }
  componentWillMount() {
    const x = this.props.item.get('x')
    const y = this.props.item.get('y')
    this.setState({
      height: this.props.item.get('height'),
      shouldBeRendered: this._shouldBeRendered(this.props),
      style: {
        height: this.props.item.get('height') + 'px',
        width: this.props.item.get('width') + 'px',
        transform: 'translate(' + x + 'px, ' + y + 'px)'
      },
      wasDragged: this.state.wasDragged,
      width: this.props.item.get('width'),
      x: x,
      y: y
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.item.get('x') !== this.props.item.get('x')) {
      this.setState({
        style: {
          height: this.state.style.height,
          width: this.state.style.width,
          transform: 'translate(' + nextProps.item.get('x') + 'px, ' + this.state.y + 'px)'
        },
        x: nextProps.item.get('x'),
        y: this.state.y
      })
    }
    const shouldBeRendered = this._shouldBeRendered(nextProps)
    this.setState({
      shouldBeRendered: shouldBeRendered
    })
    if (shouldBeRendered) {
      if (this.audioRef) {
        this.savedTime = this.audioRef.currentTime
      }
    }
    if (this.props.isShowingMetadata !== nextProps.isShowingMetadata) {
      if (nextProps.isShowingMetadata) {
        this._setVolume(0)
      }
      else {
        if (this._shouldBeMuted(nextProps)) {
          this._setVolume(0)
        }
        else {
          this._setVolume(1)
        }
      }
    }
    else if (this._shouldBeMuted(this.props) !== this._shouldBeMuted(nextProps)) {
      if (this._shouldBeMuted(nextProps)) {
        if (!this.isFadingOut) {
          fadeOut((v) => {
            this.isFadingOut = true
            if (this.props.isShowingMetadata) {
              this._setVolume(0)
            }
            else if (this._shouldBeMuted(this.props)) {
              this._setVolume(v)
            }
          }, 3000, () => {
            this.isFadingOut = false
          })
        }
      }
      else if (!this._shouldBeMuted(nextProps)) {
        if (!this.isFadingIn) {
          fadeIn((v) => {
            this.isFadingIn = true
            if (this.props.isShowingMetadata) {
              this._setVolume(0)
            }
            else if (!this._shouldBeMuted(this.props)) {
              this._setVolume(v)
            }
          }, 3000, () => {
            this.isFadingIn = false
          })
        }
      }
    }
  }
  componentWillUnmount() {
    // http://stackoverflow.com/questions/3258587/how-to-properly-unload-destroy-a-video-element
    if (this.audioRef) {
      this.audioRef.pause()
      this.audioRef.src = ''
      this.audioRef.load()
    }
  }
  render() {
    let audio = null;
    if (this.state.shouldBeRendered) {
      audio = (
        <audio loop
          onCanPlayThrough={this._handleCanPlayThrough}
          preload='none'
          ref={(ref) => { this.audioRef = ref; }}
        >
          <source src={getCloudFrontUrl(this.props.item.getIn(['results', 'encode', 'ssl_url']))} type='audio/mpeg' />
        </audio>
      )
    }
    return (
      <DraggableCore cancel='.react-resizable-handle'
        onDrag={this._handleDrag}
        onMouseDown={this._handleMouseDown}
        onStop={this._handleDragStop}>
        <Resizable height={this.state.height}
          lockAspectRatio={true}
          onResize={this._handleResize}
          onResizeStop={this._handleResizeStop}
          width={this.state.width}>
          <div className={this._getClassName()}
            onClick={this._handleClick}
            ref='item'
            style={this.state.style}>
            {audio}
            <div className='obstructor'></div>
            <Waveform item={this.props.item} />
            <Metadata baseUrl={this.props.baseUrl}
              deleteItem={this.props.deleteItem}
              featuredItemId={this.props.featuredItemId}
              hideMetadata={this.props.hideMetadata}
              isShowingMetadata={this.props.isShowingMetadata}
              item={this.props.item}
              setFeaturedItemId={this.props.setFeaturedItemId}
              setItemMetadata={this.props.setItemMetadata}
              user={this.props.user} />
            <Unlink itemId={this.props.item.get('id')} />
            <LinkStills item={this.props.item} />
          </div>
        </Resizable>
      </DraggableCore>
    )
  }
}
