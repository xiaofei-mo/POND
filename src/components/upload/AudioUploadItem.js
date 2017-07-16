import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';
import ProgressBar from './ProgressBar';
import Cancel from './Cancel';
import Processing from './Processing';

const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  upload: PropTypes.object.isRequired,
  uploadId: PropTypes.string.isRequired,
  cancelUpload: PropTypes.func.isRequired,
};

export default class AudioUploadItem extends React.Component {
  constructor() {
    super();
    this.render = this.render.bind(this);
  }
  render() {
    const status = this.props.upload.get('status');
    const cancelable = status === 'dropped' || status === 'uploading';
    const processing = status === 'uploaded' || status === 'processing';

    return (
      <li
        className="upload-item"
        style={{
          left: this.props.upload.get('x'),
          top: this.props.upload.get('y'),
        }}
      >
        <div className="waveform" />
        {cancelable ? (
          <Cancel
            uploadId={this.props.uploadId}
            cancelUpload={this.props.cancelUpload}
          />
        ) : null}
        {processing ? (
          <Processing />
        ) : null}
        <ProgressBar percent={this.props.upload.get('progress')} />
      </li>
    )
  }
}
