
import React from 'react';
import PropTypes from 'prop-types';

export default class AppAutoCompleteUserRow extends React.PureComponent {

  static propTypes = {
    name: PropTypes.string,
    username: PropTypes.string,
    avatar: PropTypes.string,
    select: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    username: '',
    avatar: '',
    select: e => null,
  }

  onClick = e => {
    const { username, select } = this.props;
    select(username);
  }

  render() {
    const { name, username, avatar } = this.props;
    return <li className="base no-select" onClick={this.onClick}>
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 14px;
          padding-bottom: 14px;
          padding-left: 14px;
          padding-right: 14px;
          cursor: pointer;
        }
        .base:hover {
          background-color: #f6f6f6;
        }
        .base:active {
          background-color: #efefef;
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
          font-weight: 600;
          color: #000;
        }
        .user-username {
          font-size: 14px;
          font-weight: 400;
          color: #999;
        }
      `}</style>
      <div className="column column-auto">
        <img className="user user-image" src={avatar} />
      </div>
      <div className="column column-fill">
        <h2 className="user user-fullname">{ name }</h2>
        <p className="user user-username">{ username }</p>
      </div>
    </li>
  }

}

