
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import { api as momentReducerApi } from '../../reducers/moment';

export default class AppMomentStats extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id            : PropTypes.string,
    impressions   : PropTypes.number,
    likes         : PropTypes.number,
    liked         : PropTypes.bool,
    authenticated : PropTypes.bool,
  }

  static defaultProps = {
    id            : '',
    impressions   : 0,
    likes         : 0,
    liked         : false,
    authenticated : false,
  }

  handleLikeToggle = e => {
    const { id, liked, authenticated } = this.props;
    const { store } = this.context;
    if ( !authenticated ) return;
    if ( liked ) {
      return store.dispatch(momentReducerApi.unlike(id));
    }
    return store.dispatch(momentReducerApi.like(id));
  }

  counter(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  render() {

    const { likes, liked, impressions, authenticated } = this.props;

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
          border-bottom: 1px solid rgba(0, 0, 0, 0.03);
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
          flex-grow: 1;
          flex-shrink: 1;
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
        .icon {
          width: 18px;
          height: 18px;
        }
        .counter {
          margin-left: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #9da6a9;
        }
        .counter-highlight {
          color: #319aff;
        }
      `}</style>

      {/* impression counter */}
      <div className="item no-select">
        <img className="icon" src="/static/emoji/2x/3030.png" />
        <span className="counter">{ nimpressions } impressions</span>
      </div>

      {/* clapping counter */}
      <div className={ authenticated ? "item item-clickable no-select" : "item no-select" } onClick={this.handleLikeToggle}>
        <img className="icon" src="/static/emoji/2x/1f44f.png" />
        <span className={ liked ? "counter counter-highlight" : "counter" }>{ nlikes } likes</span>
      </div>
    </div>
  }

}

