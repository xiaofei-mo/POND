import React from 'react'

export default class Terms extends React.Component {
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
