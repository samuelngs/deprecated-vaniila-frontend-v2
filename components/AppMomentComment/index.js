
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';

import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import { api as commentsReducerApi } from '../../reducers/comments';

export default class AppMomentComment extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    id      : PropTypes.string, // moment id
    cid     : PropTypes.number, // comment id
    name    : PropTypes.string,
    avatar  : PropTypes.string,
    username: PropTypes.string,
    comment : PropTypes.string,
    when    : PropTypes.string,
    controls: PropTypes.bool,
  }

  static defaultProps = {
    id      : '',
    cid     : 0,
    name    : '',
    avatar  : '',
    username: '',
    comment : '',
    when    : '1970-01-01T00:00:00.000Z',
    controls: false,
  }

  handleUsernamePress = e => {
    e.preventDefault && e.preventDefault();

    const { username } = this.props;
    const { store: { getState } } = this.context;

    const { serverPathname, serverQuery, serverQuery: { username: current } } = getState();

    if ( serverPathname === '/list-moments' && username === current ) {
      return Router.back();
    }

    return Router.push({
      pathname: '/list-moments',
      query   : { username },
    }, `/${username}`);
  }

  handleDeleteComment = e => {
    const { store } = this.context;
    const { id, cid } = this.props;
    store.dispatch(commentsReducerApi.deleteComment(id, cid));
  }

  render() {
    const { name, avatar, username, comment, when, controls } = this.props;
    const date = `${distanceInWordsStrict(new Date(when), new Date())} ago`;
    return <li className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: row;
          min-height: 40px;
          padding-top: 2px;
          padding-bottom: 2px;
          padding-left: 18px;
          padding-right: 18px;
        }
        .avatar-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 40px;
        }
        .avatar-image {
          height: 28px;
          width: 28px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 19px;
        }
        .comment-container {
          flex: 1;
          flex-direction: column;
          display: flex;
          margin-top: 6px;
          margin-left: 12px;
          line-height: 1.1;
          font-size: 13px;
          font-weight: 400;
          color: #777;
          word-break: break-all;
        }
        .comment-user {
          display: inline;
          margin-bottom: 1px;
        }
        .comment-author {
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          color: #000;
        }
        .comment-author:hover,
        .comment-author:active {
          color: #777;
        }
        .comment-username {
          font-size: 13px;
          font-weight: 300;
        }
        .comment-when {
          font-size: 13px;
          font-weight: 300;
          color: #68b5ff;
        }
        .comment-delete {
          display: block;
          margin-top: 6px;
          margin-bottom: 4px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          color: #319aff;
          font-size: 13px;
          font-weight: 300;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
      <div className="avatar-container">
        <a className="comment-author" href={`/${username}`} onClick={this.handleUsernamePress}>
          <img className="avatar-image" src={avatar} />
        </a>
      </div>
      <div className="comment-container">
        <h4 className="comment-user">
          <a className="comment-author" href={`/${username}`} onClick={this.handleUsernamePress}>
            { name || username }
          </a>
          <span className="comment-username"> @{ username }</span>
          <span className="comment-when"> · { date }</span>
        </h4>
        { comment }
        <If condition={controls}>
          <a className="comment-delete" onClick={this.handleDeleteComment}>delete this comment</a>
        </If>
      </div>
    </li>
  }

}
