
import React from 'react';
import PropTypes from 'prop-types';

export default class AppDropdownItem extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    dismiss : PropTypes.func,
    onPress : PropTypes.func,
  }

  static defaultProps = {
    children: null,
    dismiss : e => null,
    onPress : e => null,
  }

  handleOnClick = e => {
    const { dismiss, onPress } = this.props;
    dismiss(e);
    onPress(e);
  }

  render() {
    const { children } = this.props;
    return <button className="base" onClick={this.handleOnClick}>
      <style jsx>{`
        .base {
          display: flex;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 10px;
          padding-right: 10px;
          background-color: transparent;
          border: none;
          outline: none;
          cursor: pointer;
        }
        .base:hover {
          background-color: #f8f8f8;
        }
        .base:active {
          background-color: #f1f1f1;
        }
      `}</style>
      { children }
    </button>
  }

}


