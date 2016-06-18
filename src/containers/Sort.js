import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from 'src/actions'

class Term extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    event.preventDefault()
    console.log('term ' + this.props.name + ' click')
  }
  render() {
    return (
      <li className='term'>
        <a href='#' onClick={this._handleClick}>{this.props.name}</a>
      </li>
    )
  }
}

class Terms extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    if (!this.props.isOpen) {
      return null
    }
    const terms = this.props.terms.map((t) => {
      return <Term key={t.get('name')} name={t.get('name')} />
    }).toArray()
    return (
      <ul className='terms'>
        {terms}
      </ul>
    )
  }
}

class Vocabulary extends React.Component {
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

export default class Sort extends React.Component {
  constructor() {
    super()
    this._handleClick = this._handleClick.bind(this)
    this._handleMouseLeave = this._handleMouseLeave.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.render = this.render.bind(this)
  }
  _handleClick(event) {
    this.props.closeAllVocabularies()
  }
  _handleMouseLeave(event) {
    this.props.closeSort()
  }
  componentWillMount() {
    this.props.listenToVocabularies()
  }
  render() {
    if (!this.props.isOpen) {
      return null
    }
    const vocabularies = this.props.vocabularies.map((v) => {
      return <Vocabulary key={v.get('name')}
                         toggleVocabulary={this.props.toggleVocabulary} 
                         vocabulary={v} />
    }).toArray()
    return (
      <div className='sort' 
           onClick={this._handleClick} 
           onMouseLeave={this._handleMouseLeave}>
        <ul className='vocabularies'>
          {vocabularies}
        </ul>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isOpen: state.getIn(['sort', 'isOpen']),
    vocabularies: state.getIn(['sort', 'vocabularies'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    closeAllVocabularies: bindActionCreators(actions.closeAllVocabularies, 
                                             dispatch),
    closeSort: bindActionCreators(actions.closeSort, dispatch),
    listenToVocabularies: bindActionCreators(actions.listenToVocabularies, 
                                             dispatch),
    toggleVocabulary: bindActionCreators(actions.toggleVocabulary, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort)
