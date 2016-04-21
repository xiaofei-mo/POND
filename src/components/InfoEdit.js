import React from 'react'

export default class InfoEdit extends React.Component {
  constructor() {
    super()
    this._handleIsFeaturedClick = this._handleIsFeaturedClick.bind(this)
    this._handleUrlClick = this._handleUrlClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleIsFeaturedClick(event) {
    this.props.setIsFeatured(this.props.item.get('id'));
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
      <div className='info-edit'>
        <ul>
          <li>
            <label>URL</label>
            <input className='url' 
                   onClick={this._handleUrlClick}
                   readOnly 
                   type='text' 
                   value={this.props.item.get('url')} />
          </li>
          <li>
            <label>Is featured?</label>
            <input className='is-featured' 
                   onClick={this._handleIsFeaturedClick}
                   type='checkbox' 
                   value={this.props.item.get('isFeatured')} />
          </li>
        </ul>
      </div>
    )
  }
}
