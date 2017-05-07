
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
          background-color: #fff;
          border-left: 1px solid #eee;
        }
        .details-container {
          display: flex;
          flex-direction: row;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 20px;
          margin-right: 20px;
          padding-top: 14px;
          padding-bottom: 14px;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 1px solid #eee;
        }
        .details-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          width: 50px;
        }
        .details-avatar-image {
          height: 40px;
          width: 40px;
          border: 1px solid #eee;
          border-radius: 20px;
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
        .details-username {
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
          color: #000;
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
          font-weight: 400;
          color: #000;
        }
      `}</style>
      <div className="details-container">
        <div className="details-avatar">
          <img className="details-avatar-image" src={avatar} />
        </div>
        <div className="details-content">
          <h3 className="details-username">{ name }</h3>
          <p className="details-title">{ title }</p>
        </div>
      </div>
      { children }
    </div>;
  }

}
