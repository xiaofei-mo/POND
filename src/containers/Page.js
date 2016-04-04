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
    if (this.props.initiallyScrolledToCenter) {
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
  }
  componentDidUpdate(prevProps) {
    const centerItemId = this.props.centerItems.keySeq().first()
    const prevCenterItemId = prevProps.centerItems.keySeq().first()
    if(centerItemId !== prevCenterItemId) {
      const scrollDestination = this.props.centerItems.first().get('scrollDestination')
      if(scrollDestination !== undefined) {
        this.bodyNode.scrollLeft = scrollDestination
        this.props.setPageInitiallyScrolledToCenter()
      }
    }
  } 
  render() {
    const items = this.props.items.map((item, key) => {
      switch (item.get('type')) {
        case 'video':
          return <VideoItem item={item} 
                            id={key} 
                            key={key} 
                            setVideoReadyToPlay={this.props.setVideoReadyToPlay} 
                            setVideoPosition={this.props.setVideoPosition} 
                            windowWidth={this.props.width} />
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

function mapStateToProps (state) {
  return {
    centerItems: state.getIn(['page', 'centerItems']),
    items: state.getIn(['page', 'items']),
    initiallyScrolledToCenter: state.getIn(['page', 'initiallyScrolledToCenter']),
    rightmostEdge: state.getIn(['page', 'rightmostEdge']),
    width: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    listenToItems: bindActionCreators(pageActions.listenToItems, dispatch),
    setPageInitiallyScrolledToCenter: bindActionCreators(pageActions.setPageInitiallyScrolledToCenter, dispatch),
    setVideoReadyToPlay: bindActionCreators(pageActions.setVideoReadyToPlay, dispatch),
    setVideoPosition: bindActionCreators(pageActions.setVideoPosition, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
