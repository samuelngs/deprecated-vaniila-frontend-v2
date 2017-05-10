
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

export default class AppMomentComment extends React.PureComponent {

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

  render() {
    const { name, avatar, username, comment } = this.props;
    return <li className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: row;
          min-height: 40px;
          padding-top: 3px;
          padding-bottom: 4px;
          padding-left: 18px;
          padding-right: 18px;
        }
        .base + .base {
          margin-top: 10px;
        }
        .avatar-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 40px;
        }
        .avatar-image {
          height: 36px;
          width: 36px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 19px;
        }
        .comment-container {
          flex: 1;
          margin-left: 12px;
          line-height: 1.1;
          font-size: 14px;
          font-weight: 400;
          color: #777;
        }
        .comment-username {
          color: #000;
          display: inline;
          margin-right: 6px;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
      <div className="avatar-container">
        <img className="avatar-image" src={avatar} />
      </div>
      <div className="comment-container">
        <h4 className="comment-username">{ name }</h4>
        { comment }
      </div>
    </li>
  }

}
