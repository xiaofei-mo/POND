import { C } from '../../constants'
import { DraggableCore } from 'react-draggable'
import getCloudFrontUrl from '../../utils/getCloudFrontUrl'
import setHashBySeconds from '../../utils/setHashBySeconds'
import ControlBar from '../metadata/ControlBar'
import React from 'react'
import { Resizable } from 'react-resizable'
import Unlink from '../link/Unlink'
import LinkStills from '../link/LinkStills'

export default class ImageItem extends React.Component {
  constructor() {
    super()
    this.state = {
      height: 0,
      shouldBeRendered: false,
      style: {
        height: '0px',
        width: '0px',
        transform: 'translate(0px, 0px)'
      },
      wasDragged: false,
      width: 0,
      x: 0,
      y: 0,
      ratio: null
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
    this._shouldAllowDragAndResize = this._shouldAllowDragAndResize.bind(this)
    this._shouldBeRendered = this._shouldBeRendered.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    var className = 'image-item'
    if (this.props.isShowingMetadata) {
      className += ' is-showing-metadata'
    }
    if (this._shouldAllowDragAndResize()) {
      className += ' should-allow-drag-and-resize'
    }
    if (!this.state.shouldBeRendered) {
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
      const bcr = this.refs.item.getBoundingClientRect()
      // const currentTime = this.refs.video.videoEl.currentTime
      this.props.itemClicked(this.props.item, bcr.left, bcr.top, 0)
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
    // http://stackoverflow.com/questions/16137381/html5-video-element-request-stay-pending-forever-on-chrome
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

    // Calculate height depending on width to lock aspect ratio
    const height = ui.size.width / this.state.ratio;

    this.setState({
      height,
      shouldBeRendered: this.state.shouldBeRendered,
      style: {
        height: height + 'px',
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
  _shouldAllowDragAndResize() {
    if (this.props.setItemPosition === undefined ||
      this.props.setItemSize === undefined) {
      return false
    }
    return this.props.user.get('uid') === this.props.item.get('userId') &&
      !this.props.isShowingMetadata
  }
  _shouldBeRendered(props) {
    const zoneLeft = props.item.get('x') + props.paddingLeft
    const zoneRight = props.item.get('x') + props.item.get('width') + props.paddingLeft
    const zoneLeftIsInViewport = zoneLeft > props.leftEdgeOfViewport && zoneLeft < props.rightEdgeOfViewport
    const zoneRightIsInViewport = zoneRight > props.leftEdgeOfViewport && zoneRight < props.rightEdgeOfViewport
    return zoneLeftIsInViewport || zoneRightIsInViewport
  }
  _shouldSetHash(props) {
    const zoneLeft = props.item.get('x') + props.paddingLeft
    const zoneRight = props.item.get('x') + props.item.get('width') + props.paddingLeft
    if (props.halfway > zoneLeft && props.halfway < zoneRight) {
      return true
    }
    return false
  }
  _setHash() {
    const timing = this.props.item.get('timing')
    setHashBySeconds(timing)
  }
  componentWillMount() {
    const x = this.props.item.get('x')
    const y = this.props.item.get('y')
    const ratio = this.props.item.getIn(['results', 'encode', 'meta', 'aspect_ratio'])
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
      y: y,
      ratio
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

    if (!this._shouldSetHash(this.props) && this._shouldSetHash(nextProps)) {
      this._setHash()
      this._requestPoetry()
    }
  }
  _requestPoetry() {
    console.log('item-----------',this.props.item);
    this.props.getPoetry(
      this.props.item.getIn(['results', 'encode', 'ssl_url']),
      this.props.item.getIn(['results', 'encode', 'mime']),
    )
  }

  render() {
    let image = null
    if (this.state.shouldBeRendered) {
      image = (
        <img
          src={getCloudFrontUrl(this.props.item.getIn(['results', 'encode', 'ssl_url']))}
          alt={this.props.item.getIn(['results', 'encode', 'basename'])}
        />
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
            {image}
            <div className='obstructor'></div>
            <ControlBar baseUrl={this.props.baseUrl}
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
