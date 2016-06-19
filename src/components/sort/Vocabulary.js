import React from 'react'

export default class Vocabulary extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    this.props.toggleVocabulary(this.props.vocabulary.get('name'))
  }
  render() {
    return (
      <li className='vocabulary'>
        <a href='#' onClick={this._handleClick}>
          {this.props.vocabulary.get('name')}
        </a>
        <Terms isOpen={this.props.vocabulary.get('isOpen')} 
               terms={this.props.vocabulary.get('terms')} />
      </li>
    )
  }
}
