
import React from 'react';
import PropTypes from 'prop-types';

export default class EditorModalEndLive extends React.PureComponent {

  static propTypes = {
    onPress: PropTypes.func,
  }

  static defaultProps = {
    onPress: e => null,
  }

  render() {
    const { onPress } = this.props;
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
        .button {
          margin-top: 30px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-right: 16px;
          padding-left: 16px;
          border-radius: 3px;
          border: none;
          outline: none;
          cursor: pointer;
          background-color: #000;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }
        .button-container {
          flex-direction: row;
          display: flex;
          align-items: center;
        }
        .button-svg {
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
        }
      `}</style>
      <h4 className="title">Time flies, huh?</h4>
      <button className="button" onClick={onPress}>
        <div className="button-container">
          <svg className="button-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M77.58 48.29l-44.84-27.5a2 2 0 0 0-3 1.71v55a2 2 0 0 0 2 2 2 2 0 0 0 1-.3l44.84-27.5a2 2 0 0 0 0-3.41z" />
          </svg>
          <span className="button-text">Stop live sharing</span>
        </div>
      </button>
    </div>
  }

}


