
import React from 'react';
import PropTypes from 'prop-types';

export default class AppDropdownItem extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    warning : PropTypes.bool,
    dismiss : PropTypes.func,
    onPress : PropTypes.func,
  }

  static defaultProps = {
    children: null,
    warning : false,
    dismiss : e => null,
    onPress : e => null,
  }

  handleOnClick = e => {
    const { dismiss, onPress } = this.props;
    dismiss(e);
    onPress(e);
  }

  render() {
    const { children, warning } = this.props;
    return <button className={ warning ? "base base-warning" : "base" } onClick={this.handleOnClick}>
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
          font-size: 14px;
          font-weight: 400;
          color: #777;
          background-color: transparent;
          border: none;
          outline: none;
          cursor: pointer;
        }
        .base-warning {
          color: #ff4949;
        }
        .base:hover {
          background-color: #f4fffe;
          color: #185be7;
        }
        .base:active {
          background-color: #edfffd;
          color: #185be7;
        }
        .base-warning:hover,
        .base-warning:active {
          color: #ff4949;
        }
      `}</style>
      { children }
    </button>
  }

}


