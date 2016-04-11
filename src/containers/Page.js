import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import VideoItem from 'src/components/VideoItem'
import C from 'src/constants'
import actions from 'src/actions'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'

class Page extends React.Component {
  constructor() {
    super()
    this._compensateForPadding = this._compensateForPadding.bind(this)
    this._getClassName = this._getClassName.bind(this)
    this._getStyle = this._getStyle.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _compensateForPadding(scrollAdjustment) {
    this.appNode.scrollLeft = this.appNode.scrollLeft - scrollAdjustment
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
      paddingLeft: this.props.paddingLeft + 'px',
      paddingRight: this.props.paddingRight + 'px'
    }
    return style
  }
  componentDidMount() {
    this.props.listenToItems(this.props.params.timing);
    this.appNode = document.getElementById('app')
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.params.timing !== nextProps.params.timing) {
      this.props.listenToItems(nextProps.params.timing)
    }
    if(this.props.scrollAdjustment !== nextProps.scrollAdjustment) {
      this._compensateForPadding(nextProps.scrollAdjustment)
    }
  }
  componentDidUpdate(prevProps) {
    const centerItemId = this.props.centerItems.keySeq().first()
    const prevCenterItemId = prevProps.centerItems.keySeq().first()
    if(centerItemId !== prevCenterItemId) {
      const scrollDestination = this.props.centerItems.first().get('scrollDestination')
      if(scrollDestination !== undefined) {
        this.appNode.scrollLeft = scrollDestination
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
                            setMostRecentlyTouched={this.props.setMostRecentlyTouched}
                            setVideoReadyToPlay={this.props.setVideoReadyToPlay} 
                            setVideoPosition={this.props.setVideoPosition} 
                            windowWidth={this.props.width} />
        default:
          return null
      }
    }).toArray()
    return (
      <div id='page' className={this._getClassName()} style={this._getStyle()}>
        {items}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    centerItems: state.getIn(['page', 'centerItems']),
    isInAddMode: state.getIn(['app', 'isInAddMode']),
    items: state.getIn(['page', 'items']),
    initiallyScrolledToCenter: state.getIn(['page', 'initiallyScrolledToCenter']),
    paddingLeft: state.getIn(['page', 'paddingLeft']),
    paddingRight: state.getIn(['page', 'paddingRight']),
    scrollAdjustment: state.getIn(['page', 'scrollAdjustment']),
    width: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    listenToItems: bindActionCreators(actions.listenToItems, dispatch),
    setPageInitiallyScrolledToCenter: bindActionCreators(actions.setPageInitiallyScrolledToCenter, dispatch),
    setVideoReadyToPlay: bindActionCreators(actions.setVideoReadyToPlay, dispatch),
    setVideoPosition: bindActionCreators(actions.setItemPosition, dispatch),
    setMostRecentlyTouched: bindActionCreators(actions.setMostRecentlyTouched, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
