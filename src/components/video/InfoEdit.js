import React from 'react'

export default class InfoEdit extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    this.refs.url.select()
  }
  render() {
    if (!this.props.isShowingInfo) {
      return null
    }
    return (
      <div className='info-edit'>
        <textarea className='url' 
                  defaultValue={this.props.item.get('url')}
                  onClick={this._handleClick} 
                  readOnly
                  ref='url' />
      </div>
    )
  }
}
