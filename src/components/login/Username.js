import React from 'react';

export default class Username extends React.Component {
  constructor() {
    super();
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.render = this.render.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isAcceptingUsername && this.props.isAcceptingUsername) {
      this.refs.input.focus();
    }
  }
  render() {
    if (!this.props.isAcceptingUsername) {
      return null;
    }
    return (
      <input
        onChange={this.props.onChange}
        onKeyUp={this.props.onKeyUp}
        placeholder='username'
        ref='input'
        type='text'
        value={this.props.username}
      />
    );
  }
}
