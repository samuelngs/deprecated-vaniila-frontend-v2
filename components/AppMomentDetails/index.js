
import React from 'react';
import PropTypes from 'prop-types';

export default class AppMomentDetails extends React.PureComponent {

  static propTypes = {
    doc     : PropTypes.object,
    children: PropTypes.node,
    style   : PropTypes.object,
  }

  static defaultProps = {
    doc     : { },
    children: null,
    style   : undefined,
  }

  render() {
    const { doc, children, style } = this.props;
    const { name: title, author: { avatar, name, username } } = doc;
    return <div className="base" style={style}>
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(0, 0, 0, 0.05);
        }
        .details-container {
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
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .details-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          width: 50px;
        }
        .details-avatar-image {
          height: 36px;
          width: 36px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 19px;
        }
        .details-content {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 10px;
          padding-right: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .details-title {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 14px;
          font-weight: 600;
          color: #000;
        }
        .details-username {
          margin-top: 2px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 14px;
          font-weight: 400;
          color: #999;
        }
      `}</style>
      <header className="details-container">
        <div className="details-avatar">
          <img className="details-avatar-image" src={avatar} />
        </div>
        <div className="details-content">
          <h1 className="details-title">{ title }</h1>
          <h4 className="details-username">{ name }</h4>
        </div>
      </header>
      { children }
    </div>;
  }

}