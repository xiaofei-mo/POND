import getCloudFrontUrl from '../../utils/getCloudFrontUrl';
import React from 'react';

export default class SourceImageItem extends React.Component {
  constructor() {
    super();
    this.render = this.render.bind(this);
  }

  render() {
    if (this.props.item === null) {
      return null;
    }
    if (this.props.item.get('type') !== 'image') {
      return null;
    }
    const style = {
      height: this.props.item.get('height') + 'px',
      left: this.props.left + 'px',
      top: this.props.top + 'px',
      width: this.props.item.get('width') + 'px',
    };
    const src = getCloudFrontUrl(this.props.item.getIn(['results', 'encode', 'ssl_url']));
    return (
      <div className='image-item is-source-item'
        style={style}>
        <div className='obstructor'></div>
        <img
          src={src}
          alt={this.props.item.getIn(['results', 'encode', 'basename'])}
        />
      </div>
    )
  }
}
