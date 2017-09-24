import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

class Editor extends Component {
  componentDidMount() {
    this.textarea.focus();
  }
  
  render() {
    return (
      <textarea
        ref={(el) => { this.textarea = el }}
        className="text-item-editor"
        value={this.props.value}
        onChange={this.props.onChange}
        onWheel={(ev) => { ev.stopPropagation() }}
        onBlur={this.props.onBlur}
      />
    );
  }
}

Editor.propTypes = propTypes;

export default Editor;
