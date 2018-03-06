import React, { Component } from 'react';

import CopyUrlBtn from './CopyUrlBtn';

class ControlBar extends Component {
  constructor(props) {
    super(props);

    this.handleFeaturedClick = this.handleFeaturedClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  userIsOwner() {
    return (
      !this.props.user.isEmpty() &&
      this.props.user.get('uid') === this.props.item.get('userId')
    );
  }

  handleFeaturedClick() {
    if (this.userIsOwner()) {
      this.props.setFeaturedItemId(this.props.item.get('id'))
    }
  }

  handleDeleteClick() {
    this.props.deleteItem(this.props.item.get('id'))
  }

  render() {
    const {
      featuredItemId,
      item,
    } = this.props;
    const isChecked = featuredItemId === item.get('id');

    let featuredCclassName = "featured";
    if (isChecked) featuredCclassName += ' checked';

    return (
      <div
        className="control-bar"
      >
        {
          this.userIsOwner() ?
            <div
              className="delete-btn"
              title="Delete item"
              onClick={this.handleDeleteClick}
            /> : null
        }
        <div
          className={featuredCclassName}
          title="featured"
          onClick={this.handleFeaturedClick}
        />
        <CopyUrlBtn baseUrl={this.props.baseUrl} item={this.props.item} />
      </div>
    );
  }
}

export default ControlBar;