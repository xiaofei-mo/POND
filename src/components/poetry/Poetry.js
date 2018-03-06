import React, { Component } from 'react';

class Poetry extends Component {
  render() {
    return (
      <div className="poetry pond_text">
        {this.props.poetry}
      </div>
    );
  }
}

export default Poetry;
