import React from 'react'
import getStringFromSeconds from '../../utils/getStringFromSeconds'

export default class Url extends React.Component {
  constructor() {
    super()
    this.render = this.render.bind(this)
  }
  render() {
    const timingString = getStringFromSeconds(this.props.item.get('timing'))
    const url = this.props.baseUrl + timingString
    return (
      <label>
        <span>URL </span>
        <input readOnly type='text' value={url} />
      </label>
    )
  }
}
