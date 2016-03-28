import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import VideoItem from 'src/components/VideoItem'
import C from 'src/constants'
import itemsActions from 'src/actions/items'

class Items extends React.Component {
  constructor() {
    super()
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
    let itemsStyle = {
      width: this.props.rightmostEdge + 'px'
    }
    return (
      <div id="items" style={itemsStyle}>
        {items}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    items: state.getIn(['items', 'items']),
    rightmostEdge: state.getIn(['items', 'rightmostEdge'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setVideoReadyToPlay: bindActionCreators(itemsActions.setVideoReadyToPlay, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Items)
