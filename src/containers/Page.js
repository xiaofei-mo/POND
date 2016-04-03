import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import VideoItem from 'src/components/VideoItem'
import C from 'src/constants'
import pageActions from 'src/actions/page'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'

class Page extends React.Component {
  constructor() {
    super()
    this.state = {
      scrolledToCenter: false
    }
    this._getStyle = this._getStyle.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
    this.bodyNode = document.getElementsByTagName('body')[0]
  }
  _getClassName() {
    let className = 'page'
    if (this.props.params.timing === undefined) {
      className += ' homepage'
    }
    if (this.state.scrolledToCenter) {
      className += ' scrolled-to-center'
    }
    return className
  }
  _getStyle() {
    let style = {
      width: this.props.rightmostEdge + 'px'
    }
    return style
  }
  componentDidMount() {
    this.props.listenToItems(this.props.params.timing);
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.params.timing !== nextProps.params.timing) {
      this.props.listenToItems(nextProps.params.timing)
    }
    let destination = nextProps.centerItem.get('destination')
    if (destination !== undefined) {
      this.bodyNode.scrollLeft = destination
      this.setState({
        scrolledToCenter: true
      })
    }
  }
  render() {
    const items = this.props.items.map((item, key) => {
      switch (item.get('type')) {
        case 'video':
          return <VideoItem item={item} 
                            id={key} 
                            key={key} 
                            setVideoReadyToPlay={this.props.setVideoReadyToPlay} />
        default:
          return null
      }
    }).toArray()
    return (
      <div id="page" className={this._getClassName()} style={this._getStyle()}>
        {items}
      </div>
    )
  }
}

function _getRightmostEdge (rightmostItem) {
  if (rightmostItem === undefined) {
    return 0
  }
  let width = rightmostItem.get('width')
  let x = rightmostItem.get('x')
  return (width / 2) + x + (window.innerWidth / 2)
}

function _getCenterItem (state) {
  let centerItem = state.getIn(['page', 'centerItem']).first()
  if (centerItem === undefined) {
    return Immutable.Map()
  }
  if (centerItem.get('isReadyToPlay', false)) {
    let destination = centerItem.get('x') - (window.innerWidth / 2) + (centerItem.get('width') / 2)
    centerItem = centerItem.set('destination', destination)
  }
  return centerItem
}

function mapStateToProps (state) {
  return {
    centerItem: _getCenterItem(state),
    items: state.getIn(['page', 'items']),
    rightmostEdge: _getRightmostEdge(state.getIn(['page', 'rightmostItem'])),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setVideoReadyToPlay: bindActionCreators(pageActions.setVideoReadyToPlay, dispatch),
    listenToItems: bindActionCreators(pageActions.listenToItems, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
