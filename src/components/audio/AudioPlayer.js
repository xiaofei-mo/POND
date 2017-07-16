import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const propTypes = {
  src: PropTypes.string.isRequired,
};

class AudioPlayer extends React.PureComponent {
  constructor() {
    super();

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.render = this.render.bind(this);
  }

  componentDidMount() {
    this.waveSurfer = WaveSurfer.create({
      container: this.audioRef,
      backend: 'MediaElement',
    });

    console.log(this.waveSurfer);

    this.waveSurfer.load(this.props.src);
    this.waveSurfer.on('ready', () => {
      this.waveSurfer.play();
    });
  }

  componentWillUnmount() {
    this.waveSurfer.destroy();
  }

  render() {
    return (
      <div className="audio-player">
        <audio autoPlay ref={(ref) => { this.audioRef = ref; }} >
          <source src={this.props.src} type="audio/mpeg" />
        </audio>
      </div>
    )
  }
}

AudioPlayer.propTypes = propTypes;

export default AudioPlayer;