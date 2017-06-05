
import React from 'react';
import PropTypes from 'prop-types';

import If from '../If';

export default class AppPermissionsItem extends React.PureComponent {

  static propTypes = {
    name: PropTypes.string,
    username: PropTypes.string,
    avatar: PropTypes.string,
    owner: PropTypes.bool,
    admin: PropTypes.bool,
    write: PropTypes.bool,
    read: PropTypes.bool,
    created_at: PropTypes.string,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    username: '',
    avatar: '',
    owner: false,
    admin: false,
    write: false,
    read: true,
    created_at: '',
    onRemove: e => null,
  }

  onRemove = e => {
    const { username, onRemove } = this.props;
    onRemove(username);
  }

  render() {
    const { name, username, owner, avatar, admin, write, read } = this.props;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 14px;
          padding-right: 14px;
          min-height: 42px;
        }
        .column {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .column + .column {
          margin-left: 10px;
        }
        .column-auto { }
        .column-fill {
          flex: 1;
        }
        .user {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .user-image {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          overflow: hidden;
        }
        .user-fullname {
          font-size: 16px;
          font-weight: 500;
          color: #000;
        }
        .user-username {
          font-size: 14px;
          font-weight: 400;
          color: #999;
        }
        .remove {
          width: 24px;
          height: 24px;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-right: 0;
          padding-left: 0;
          border: none;
          border-radius: 12px;
          background-color: #f6f6f6;
          font-size: 13px;
          font-weight: 400;
          color: #b7b7b7;
          cursor: pointer;
          outline: none;
        }
      `}</style>
      <div className="column column-auto">
        <img className="user user-image" src={avatar} />
      </div>
      <div className="column column-fill">
        <h2 className="user user-fullname">{ name }</h2>
        <p className="user user-username">{ username }</p>
      </div>
      <If condition={!owner}>
        <div className="column column-auto">
          <button className="remove" onClick={this.onRemove}>✕</button>
        </div>
      </If>
    </div>
  }

}



