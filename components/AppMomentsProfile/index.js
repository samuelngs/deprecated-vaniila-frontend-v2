
import React from 'react';
import PropTypes from 'prop-types';

export default class AppMomentsProfile extends React.PureComponent {

  static propTypes = {
    user: PropTypes.object,
  }

  static defaultProps = {
    user: { },
  }

  render() {
    const { user: { avatar, name, username, created_at } } = this.props;
    return <div className="base">
      <style jsx>{`
        .base {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 30px;
          padding-bottom: 60px;
          padding-left: 0;
          padding-right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .avatar {
          margin-top: 0;
          margin-bottom: 10px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          width: 80px;
          height: 80px;
          border-radius: 40px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .name {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 24px;
          font-weight: 600;
          color: #000;
        }
        .username {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 16px;
          font-weight: 600;
          color: #777;
        }
      `}</style>
      <img className="avatar" src={(avatar || '').replace('_normal', '_bigger')} />
      <h4 className="name">{ name }</h4>
      <p className="username">@{ username }</p>
    </div>
  }

}


