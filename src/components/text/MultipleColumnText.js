import React, { Component, PropTypes } from 'react';

const propTypes = {
  value: PropTypes.string.isRequired,
}

class MultipleColumnText extends Component {
  render() {
    if (!this.props.value.trim()) {
      return <p className="multiple-column-text placeholder">Type something here...</p>
    }

    return (
      <p className="multiple-column-text">{this.props.value}</p>
    )
  }
}

MultipleColumnText.propTypes = propTypes;

export default MultipleColumnText;
