import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AddModeToggle from 'src/components/AddModeToggle'
import AddMode from 'src/components/AddMode'
import actions from 'src/actions'

class App extends React.Component {
  constructor() {
    super()
    this._getClassName = this._getClassName.bind(this)
    this.render = this.render.bind(this)
  }
  _getClassName() {
    let className = 'app'
    if (this.props.isInAddMode) {
      className += ' is-in-add-mode'
    }
    return className
  }
  render() {
    return (
      <div id='app' className={this._getClassName()}>
        {this.props.children}
        <AddModeToggle isInAddMode={this.props.isInAddMode} 
                       enterAddMode={this.props.enterAddMode} 
                       exitAddMode={this.props.exitAddMode} />
        <AddMode isInAddMode={this.props.isInAddMode} 
                 handleDroppedFile={this.props.handleDroppedFile} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isInAddMode: state.getIn(['app', 'isInAddMode'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    enterAddMode: bindActionCreators(actions.enterAddMode, dispatch),
    exitAddMode: bindActionCreators(actions.exitAddMode, dispatch),
    handleDroppedFile: bindActionCreators(actions.handleDroppedFile, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
