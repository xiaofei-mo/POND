import React, { Component } from 'react';

class Poetry extends Component {
  render() {
    return (
      <div className="poetry">
        {this.props.poetry}
      </div>
    );
  }
}

export default Poetry;
