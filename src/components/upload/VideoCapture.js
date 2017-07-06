import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string.isRequired,
};

class VideoCapture extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      width: 0,
      height: 0,
    };

    this.render = this.render.bind(this);
    this.onVideoLoaded = this.onVideoLoaded.bind(this);
  }

  onVideoLoaded() {
    const { videoWidth, videoHeight } = this.videoRef;
    const width = videoWidth > 480 ? 480 : videoWidth;
    const height = width * videoHeight / videoWidth;
    this.setState({
      width,
      height,
    }, () => { this.canvasRef.getContext('2d').drawImage(this.videoRef, 0, 0); });
  }

  render() {
    return (
      <div className="video-capture">
        <video
          src={this.props.src}
          ref={(ref) => { this.videoRef = ref; }}
          onLoadedData={this.onVideoLoaded}
          autoPlay={false}
          loop={false}
          style={{
            display: 'none',
          }}
        />
        <canvas
          width={this.state.width}
          height={this.state.height}
          ref={(ref) => { this.canvasRef = ref; }}
        />
      </div>
    );
  }
}

VideoCapture.propTypes = propTypes;

export default VideoCapture;
