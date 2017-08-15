import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import actions from '../../actions';

const propTypes = {
  itemId: PropTypes.string,
};

class Unlink extends React.PureComponent {
  constructor() {
    super();

    this.render = this.render.bind(this);
  }

  // handleClick(ev) {
  //   ev.preventDefault();

  //   this.props.unlink(this.props.sourceItem.get('id'), this.props.itemId);
  // }

  render() {
    const { sourceItem } = this.props;
    if (!(sourceItem && sourceItem.get('linkedTo'))) return null;

    const distItemIds = sourceItem.get('linkedTo').valueSeq();
    if (!distItemIds.includes(this.props.itemId)) return null;

    return (
      <div
        className="unlink"
      >
        <div style={{ backgroundImage: 'url("/static/unlink.png")' }}></div>
      </div>
    );
  }
}

Unlink.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    sourceItem: state.getIn(['link', 'source', 'item']),
  };
}

// function mapDispatchToProps(dispatch) {
//   return {
//     unlink: bindActionCreators(actions.unlink, dispatch),
//   };
// }

export default connect(mapStateToProps)(Unlink);
