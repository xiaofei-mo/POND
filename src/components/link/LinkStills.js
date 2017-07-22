import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import actions from '../../actions';

const propTypes = {
  item: PropTypes.object.isRequired,
};

class LinkStills extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      currentStill: 0,
      isHovered: false,
      isShowingStills: false,
    };

    // this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.nextStill = this.nextStill.bind(this);
    this.startSwapStills = this.startSwapStills.bind(this);
    this.stopSwapStills = this.stopSwapStills.bind(this);
    this.requestStills = debounce(this.requestStills.bind(this), 1e3);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.render = this.render.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // linkStills
  //   if (nextProps.linkStills !== this.props.linkStills) return true;
  // }

  nextStill() {
    if (this.state.isShowingStills) {
      this.setState(prevState => ({
        currentStill: prevState.currentStill + 1,
      }));
    }
  }

  startSwapStills() {
    const timerId = setInterval(this.nextStill, 1e3);
    this.timerId = timerId;
    this.setState({
      isShowingStills: true,
    });
  }

  stopSwapStills() {
    clearInterval(this.timerId);
    this.setState({
      currentStill: 0,
      isShowingStills: false,
    });
  }

  requestStills() {
    if (this.state.isHovered) {
      this.props.requestStills(this.props.item);
      this.startSwapStills();
    }
  }

  handleMouseOver() {
    if (!this.state.isHovered) {
      this.setState({
        isHovered: true,
      });
      this.requestStills();
    }
  }

  handleMouseOut() {
    this.setState({
      isHovered: false,
    });

    this.stopSwapStills();
  }

  render() {
    if (!this.props.item.get('linkedTo')) return null;

    const { linkStills } = this.props;
    // let stills = null;
    // if (this.props.linkStills) {
    //   stills = this.props.linkStills.mapEntries(([id, url], index) => [
    //     id,
    //     <li
    //       className="still"
    //       key={id}
    //       style={{
    //         backgroundImage: `url("${url}")`,
    //         opacity: this.state.currentStill === index ? 1 : 0,
    //       }}
    //     />,
    //   ]).toArray();
    // }

    let src = null;
    if (linkStills && this.state.isShowingStills) {
      const validIndex = this.state.currentStill % linkStills.size;
      src = linkStills.toIndexedSeq().get(validIndex);
    }

    return (
      <div
        className="link-stills"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        style={{
          backgroundImage: src ? `url("${src}")` : null,
        }}
      />
    );
  }
}

LinkStills.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    linkStills: state.getIn(['link', 'linkStills']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestStills: bindActionCreators(actions.requestStills, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkStills);