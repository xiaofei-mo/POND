import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import VideoItem from 'src/components/video/VideoItem'
import C from 'src/constants'
import actions from 'src/actions'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import TextItem from 'src/components/text/TextItem'

class Page extends React.Component {
  constructor() {
    super()
    this._compensateForPadding = this._compensateForPadding.bind(this)
    this._getClassName = this._getClassName.bind(this)
    this._getStyle = this._getStyle.bind(this)
    this._handleClick = this._handleClick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }
  _compensateForPadding(scrollAdjustment) {
    this.scrollerNode.scrollLeft -= scrollAdjustment
  }
  _getClassName() {
    let className = 'page'
    if (this.props.params.timingOrUsername === undefined) {
      className += ' homepage'
    }
    if (this.props.initiallyScrolled) {
      className += ' initially-scrolled'
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
  _handleClick(event) {
    if (event.target === this.refs.page) {
      if (this.props.isShowingMetadata) {
        this.props.hideMetadata()
      }
      else if (event.metaKey) {
        const x = event.clientX + this.props.scrollLeft - this.props.paddingLeft
        this.props.createTextItem(x, event.clientY, this.props.authData)
      }
    }
  }
  componentDidMount() {
    this.props.listenToItems(this.props.params.timingOrUsername);
    this.scrollerNode = document.getElementById('scroller')
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.params.timingOrUsername !== nextProps.params.timingOrUsername) {
      this.props.listenToItems(nextProps.params.timingOrUsername)
    }
    if(this.props.scrollAdjustment !== nextProps.scrollAdjustment) {
      this._compensateForPadding(nextProps.scrollAdjustment)
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.scrollDestination !== undefined && 
        !this.props.initiallyScrolled) {
      this.scrollerNode.scrollLeft = this.props.scrollDestination
      this.props.setPageInitiallyScrolled()
    }
  } 
  render() {
    const items = this.props.items.map((item, key) => {
      switch (item.get('type')) {
        case 'text':
          return <TextItem authData={this.props.authData}
                           id={key} 
                           isShowingMetadata={this.props.isShowingMetadata}
                           item={item} 
                           key={key} 
                           setMostRecentlyTouched={this.props.setMostRecentlyTouched}
                           setItemPosition={this.props.setItemPosition} />
        case 'video':
          return <VideoItem authData={this.props.authData}
                            editItem={this.props.editItem}
                            height={this.props.height}
                            id={key}
                            isShowingMetadata={this.props.isShowingMetadata}
                            item={item}
                            key={key}
                            setMostRecentlyTouched={this.props.setMostRecentlyTouched}
                            setItemPosition={this.props.setItemPosition}
                            setVideoReadyToPlay={this.props.setVideoReadyToPlay} />
        default:
          return null
      }
    }).toArray()
    return (
      <div className={this._getClassName()} 
           id='page' 
           onClick={this._handleClick} 
           ref='page'
           style={this._getStyle()}
      >
        {items}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    authData: state.getIn(['app', 'authData']),
    height: state.getIn(['page', 'height']),
    isInAddMode: state.getIn(['app', 'isInAddMode']),
    isShowingMetadata: state.getIn(['app', 'isShowingMetadata']),
    items: state.getIn(['page', 'items']),
    initiallyScrolled: state.getIn(['page', 'initiallyScrolled']),
    paddingLeft: state.getIn(['page', 'paddingLeft']),
    paddingRight: state.getIn(['page', 'paddingRight']),
    scrollAdjustment: state.getIn(['page', 'scrollAdjustment']),
    scrollDestination: state.getIn(['page', 'scrollDestination']),
    scrollLeft: state.getIn(['page', 'scrollLeft']),
    width: state.getIn(['page', 'width'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createTextItem: bindActionCreators(actions.createTextItem, dispatch),
    editItem: bindActionCreators(actions.editItem, dispatch),
    hideMetadata: bindActionCreators(actions.hideMetadata, dispatch),
    listenToItems: bindActionCreators(actions.listenToItems, dispatch),
    setPageInitiallyScrolled: bindActionCreators(actions.setPageInitiallyScrolled, dispatch),
    setVideoReadyToPlay: bindActionCreators(actions.setVideoReadyToPlay, dispatch),
    setItemPosition: bindActionCreators(actions.setItemPosition, dispatch),
    setMostRecentlyTouched: bindActionCreators(actions.setMostRecentlyTouched, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
