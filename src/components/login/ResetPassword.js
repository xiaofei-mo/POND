import React from 'react';

export default class Email extends React.Component {
  constructor() {
    super();
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.render = this.render.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isResettingPassword && this.props.isResettingPassword) {
      this.inputRef.focus();
    }
  }

  render() {
    if (!this.props.isResettingPassword) {
      return null;
    }
    return (
      <input
        onChange={this.props.onChange}
        onKeyUp={this.props.onKeyUp}
        placeholder='Forgot password? enter email'
        ref={(ref) => { this.inputRef = ref; }}
        type='text'
        value={this.props.email}
      />
    );
  }
}
