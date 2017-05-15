
import React from 'react';
import PropTypes from 'prop-types';

export default class AppDropdownMenu extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    dismiss : PropTypes.func,
  }

  static defaultProps = {
    children: null,
    dismiss : e => null,
  }

  render() {
    const { children, dismiss } = this.props;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 0;
          padding-right: 0;
          min-width: 160px;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12)
        }
      `}</style>
      { React.Children.map(children, child => React.cloneElement(child, { dismiss })) }
    </div>
  }

}

