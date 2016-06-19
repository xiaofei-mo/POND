import React from 'react'
import { Link } from 'react-router'
import { DraggableCore } from 'react-draggable'
import Metadata from 'src/components/shared/Metadata'

export default class TextItem extends React.Component {
  constructor() {
    super()
    this.state = {
      style: {
        width: '0px',
        height: '0px',
        transform: 'translate(0px, 0px)'
      },
      wasDragged: false,
      x: 0,
      y: 0
    }
    this._getClassName = this._getClassName.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this._handleDrag = this._handleDrag.bind(this)
    this._handleMouseDown = this._handleMouseDown.bind(this)
    this._handleStop = this._handleStop.bind(this)
    this._setStyle = this._setStyle.bind(this)
    this._truncateText = this._truncateText.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    var className = 'text-item'
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
  _handleDrag(event, ui) {
    if (this.props.isShowingInfo) {
      return false
    }
    const x = this.state.x + ui.position.deltaX
    let y = this.state.y + ui.position.deltaY
    const bottom = y + this.props.item.get('height')
    if (bottom > this.props.height) {
      y = this.props.height - this.props.item.get('height')
    }
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
    if (this.props.isShowingInfo) {
      return false
    }
    this.props.setMostRecentlyTouched(this.props.id)
    let state = this.state
    state['wasDragged'] = false
    this.setState(state)
  }
  _handleStop(event, ui) {
    this.props.setItemPosition(this.props.id, this.state.x, this.state.y)
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
  _truncateText() {
    let el = this.refs.textItemContent
    let setTitleOnce = function () {
      el.title = el.textContent;
      setTitleOnce = function () {};
    };
    while (el.scrollHeight - (el.clientHeight || el.offsetHeight) >= 1) {
      if (el.textContent === '...') {
        break;
      }
      setTitleOnce();
      el.textContent = el.textContent.replace(/(.|\s)(\.\.\.)?$/, '...');
    }
  }
  componentDidMount() {
    this._truncateText()
  }
  componentDidUpdate() {
    this._truncateText()
  }
  componentWillMount() {
    this._setStyle(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.item.get('x') !== nextProps.item.get('x') || this.props.item.get('y') !== nextProps.item.get('y')) {
      this._setStyle(nextProps)
    }
  }
  render() {
    let textItem = (
      <div className={this._getClassName()} 
           ref='textItem'
           style={this.state.style}>
        <div className='text-item-content' ref='textItemContent'>
          {this.props.item.get('content')}
        </div>
        <Metadata isShowingMetadata={this.props.isShowingMetadata} 
                  item={this.props.item} />
      </div>
    )
    if(this.props.item.get('linkedTo')) {
      textItem = (
        <Link to={'/' + this.props.item.get('linkedTo')} 
              onClick={this._handleClick}>
          {textItem}
        </Link>
      )
    }
    if (this.props.authData !== null && !this.props.authData.isEmpty()) {
      if (this.props.item.get('userId') === this.props.authData.get('uid')) {
        // This particular video belongs to the logged-in user.
        return (
          <DraggableCore onDrag={this._handleDrag} 
                         onStop={this._handleStop} 
                         onMouseDown={this._handleMouseDown}>
            {textItem}
          </DraggableCore>
        )
      }
    }
    // Not logged in, or current user does not own video.
    return textItem
  }
}
