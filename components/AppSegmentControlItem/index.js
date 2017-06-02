
import React from 'react';
import PropTypes from 'prop-types';

export default class AppSegmentControlItem extends React.PureComponent {

  static propTypes = {
    id: PropTypes.string,
    selected: PropTypes.string,
    children: PropTypes.node,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    id: '',
    selected: '-',
    children: null,
    onPress: e => null,
  }

  onClick = e => {
    const { id, onPress } = this.props;
    onPress(id);
  }

  render() {
    const { id, selected, children, onPress } = this.props;
    return <li className={ id === selected ? "active" : "normal" } onClick={this.onClick}>
      <style jsx>{`
        li {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 10px;
          padding-right: 10px;
          list-style: none;
          height: 26px;
          cursor: pointer;
        }
        li.active {
          background-color: #82a3b7;
        }
        li.active span {
          color: #fff;
        }
        li + li {
          border-left: 1px solid #82a3b7;
        }
        span {
          font-weight: 400;
          font-size: 14px;
          color: #82a3b7;
        }
      `}</style>
      <span>{ children }</span>
    </li>
  }

}

