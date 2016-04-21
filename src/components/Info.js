import React from 'react'

export default class Info extends React.Component {
  constructor() {
    super()
    this._handleUrlClick = this._handleUrlClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleUrlClick(event) {
    event.preventDefault()
    event.target.select()
  }
  render() {
    if (!this.props.isShowingInfo) {
      return null
    }
    return (
      <div className='info'>
        <div className='info-item'>
          <label>URL</label>
          <input className='url' 
                 onClick={this._handleUrlClick}
                 readOnly 
                 type='text' 
                 value={this.props.item.get('url')} />
        </div>
      </div>
    )
  }
}
