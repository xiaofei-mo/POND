import React from 'react'

export default class InfoMoreInfo extends React.Component {
  constructor() {
    super()
    this._handleInfoClick = this._handleInfoClick.bind(this)
    this._handleMoreInfoClick = this._handleMoreInfoClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleInfoClick(event) {
    event.preventDefault()
    this.props.showInfo()
  }
  _handleMoreInfoClick(event) {
    event.preventDefault()
    console.log('more info click')
  }
  render() {
    if (this.props.isShowingInfo) {
      return <a className='info-more-info' href='#' onClick={this._handleMoreInfoClick}>More Info</a>
    }
    return <a className='info-more-info' href='#' onClick={this._handleInfoClick}>Info</a>
  }
}
