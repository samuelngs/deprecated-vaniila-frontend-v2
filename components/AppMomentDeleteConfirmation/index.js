
import React from 'react';
import PropTypes from 'prop-types';

export default class AppMomentDeleteConfirmation extends React.PureComponent {

  static propTypes = {
    name    : PropTypes.string,
    author  : PropTypes.string,
    onPress : PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    name    : '',
    author  : '',
    onPress : e => null,
    onCancel: e => null,
  }

  render() {
    const { name, author, onPress, onCancel } = this.props;
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
          padding: 0;
          width: 800px;
          max-width: calc(100% - 80px);
        }
        .title {
          font-size: 20px;
          font-weight: 300;
          width: 100%;
          text-align: center;
        }
        .button-options {
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          display: flex;
          flex-direction: column;
        }
        .button {
          margin-top: 10px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-right: 12px;
          padding-left: 12px;
          border-radius: 3px;
          border: none;
          outline: none;
          cursor: pointer;
          background-color: #000;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        .button-cancel {
          background-color: #f8f8f8;
          color: #8e8e8e;
        }
        .button-container {
          flex-direction: row;
          display: flex;
          align-items: center;
        }
        .button-icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
          fill: #fff;
        }
        .button-text {
          margin-top: 2px;
        }
        @media (min-width: 768px) {
          .title {
            font-size: 40px;
          }
          .button {
            padding-right: 20px;
            padding-left: 20px;
            font-size: 16px;
          }
          .button-options {
            display: initial;
          }
          .button + .button {
            margin-left: 6px;
          }
        }
      `}</style>
      <h4 className="title">“{ name }” will be gone forever</h4>
      <div className="button-options">
        <button className="button" onClick={onPress}>
          <div className="button-container">
            <img className="button-icon" src="/static/emoji/2x/1f648.png" />
            <span className="button-text">Yes, Captain!</span>
          </div>
        </button>
        <button className="button button-cancel" onClick={onCancel}>
          <div className="button-container">
            <img className="button-icon" src="/static/emoji/2x/1f640.png" />
            <span className="button-text">Ah no! I came here by mistake</span>
          </div>
        </button>
      </div>
    </div>
  }

}

