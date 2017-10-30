import Clipboard from 'clipboard'
import getPseudorandomId from '../../utils/getPseudorandomId'
import getStringFromSeconds from '../../utils/getStringFromSeconds'
import React from 'react'

export default class CopyUrl extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.render = this.render.bind(this)
    this.state = {
      targetId: getPseudorandomId(),
      triggerId: getPseudorandomId()
    }
  }
  _handleClick(event) {
    event.preventDefault()
  }
  componentDidMount() {
    const triggerSelector = '#' + this.state.triggerId
    const clipboard = new Clipboard(triggerSelector)
  }
  render() {
    const timingString = getStringFromSeconds(this.props.item.get('timing'))
    const url = this.props.baseUrl + timingString
    const targetSelector = '#' + this.state.targetId
    return (
      <div className="copy-url-btn" title="copy-url">
        <input
          className='target'
          id={this.state.targetId}
          readOnly
          tabIndex='-1'
          type='text'
          value={url}
        />
        <a
          data-clipboard-target={targetSelector}
          href='#'
          id={this.state.triggerId}
          onClick={this._handleClick}
        />
      </div>
    )
  }
}
