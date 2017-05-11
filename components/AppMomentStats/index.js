
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import Tooltip from '../Tooltip';

export default class AppMomentStats extends React.PureComponent {

  static propTypes = {
    id          : PropTypes.string,
    impressions : PropTypes.number,
    likes       : PropTypes.number,
  }

  static defaultProps = {
    id          : '',
    impressions : 0,
    likes       : 0,
  }

  counter(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  render() {

    const { likes, impressions } = this.props;

    const nlikes = this.counter(likes);
    const nimpressions = this.counter(impressions);

    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          min-height: 40px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .item {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 22px;
          padding-right: 22px;
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          white-space: nowrap;
        }
        .item-clickable {
          cursor: pointer;
        }
        .item-clickable:hover {
          background-color: #f8f8f8;
        }
        .item-clickable:active {
          background-color: #f2f2f2;
        }
        .item + .item {
          border-left: 1px solid #eee;
        }
        .icon {
          width: 18px;
          height: 18px;
        }
        .counter {
          margin-top: 3px;
          margin-left: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #9da6a9;
        }
      `}</style>

      {/* impression counter */}
      <div className="item">
        <img className="icon" src="/static/emoji/2x/3030.png" />
        <span className="counter">{ nimpressions } impressions</span>
      </div>

      {/* clapping counter */}
      <div className="item item-clickable no-select">
        <img className="icon" src="/static/emoji/2x/1f44f.png" />
        <span className="counter">{ nlikes } likes</span>
      </div>
    </div>
  }

}

