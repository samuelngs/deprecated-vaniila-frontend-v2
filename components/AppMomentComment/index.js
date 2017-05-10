
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

export default class AppMomentComment extends React.PureComponent {

  static contextTypes = {
    store: PropTypes.object,
  }

  static propTypes = {
    name    : PropTypes.string,
    avatar  : PropTypes.string,
    username: PropTypes.string,
    comment : PropTypes.string,
  }

  static defaultProps = {
    name    : '',
    avatar  : '',
    username: '',
    comment : '',
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

  render() {
    const { name, avatar, username, comment } = this.props;
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
          margin-top: 7px;
          margin-left: 12px;
          line-height: 1.1;
          font-size: 13px;
          font-weight: 400;
          color: #777;
          word-break: break-all;
        }
        .comment-username {
          display: inline;
          margin-right: 6px;
        }
        .comment-author {
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          color: #000;
        }
      `}</style>
      <div className="avatar-container">
        <a className="comment-author" href={`/${username}`} onClick={this.handleUsernamePress}>
          <img className="avatar-image" src={avatar} />
        </a>
      </div>
      <div className="comment-container">
        <h4 className="comment-username">
          <a className="comment-author" href={`/${username}`} onClick={this.handleUsernamePress}>
            { name || username }
          </a>
        </h4>
        { comment }
      </div>
    </li>
  }

}
