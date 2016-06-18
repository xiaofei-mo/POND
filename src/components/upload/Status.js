import React from 'react'

export default class Status extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    if (this.props.upload.get('status') === 'Done') {
      return null
    }
    return <div className='status'>{this.props.upload.get('status')}</div>
  }
}
