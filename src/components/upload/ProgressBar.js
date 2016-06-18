import React from 'react'

export default class ProgressBar extends React.Component {
  constructor() {
    super()
    this._getStyle = this._getStyle.bind(this)
    this.render = this.render.bind(this)
  }
  _getStyle() {
    let percent = this.props.percent;
    if (percent < 0) {
      percent = 0
    }
    else if (percent > 100) {
      percent = 100
    }
    return {
      width: percent + '%'
    }
  }
  render() {
    return (
      <div className='progress-bar'>
        <div className='progress' style={this._getStyle()}></div>
      </div>
    )
  }
}
