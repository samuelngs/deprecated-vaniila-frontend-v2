
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import If from '../If';

export default class AppMomentChatHistory extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    name    : PropTypes.string,
    username: PropTypes.string,
    message : PropTypes.string,
    when    : PropTypes.string,
  }

  static defaultProps = {
    name    : '',
    username: '',
    message : '',
    when    : '1970-01-01T00:00:00.000Z',
  }

  render() {
    const { name, username, message, when } = this.props;
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
        .message-container {
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
        .message-user {
          display: inline;
          margin-bottom: 1px;
        }
        .message-author {
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          color: #000;
        }
        .message-author:hover,
        .message-author:active {
          color: #777;
        }
        .message-username {
          font-size: 13px;
          font-weight: 300;
        }
        .message-when {
          font-size: 13px;
          font-weight: 300;
          color: #68b5ff;
        }
        .message-delete {
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
          font-size: 11px;
          font-weight: 300;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
      <div className="message-container">
        <h4 className="message-user">
          <a className="message-author">
            { name || username }
          </a>
          <If condition={!!username}>
            <span className="message-username"> @{ username }</span>
          </If>
        </h4>
        { message }
      </div>
    </li>
  }

}
