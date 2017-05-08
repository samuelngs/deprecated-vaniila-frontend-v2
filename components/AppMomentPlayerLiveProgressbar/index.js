
import React from 'react';
import PropTypes from 'prop-types';

export default class AppMomentPlayerLiveProgressbar extends React.PureComponent {

  static propTypes = {
    color   : PropTypes.string,
    active  : PropTypes.bool,
  }

  static defaultProps = {
    color   : 'rgba(100, 100, 100, .5)',
    active  : false,
  }

  render() {
    const { active, color: backgroundColor } = this.props;
    return active ? <div className="base">
      <style jsx>{`
        @keyframes movement {
          0% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(-60px);
          }
          100% {
            transform: translateX(-60px);
          }
        }
        @keyframes opacity {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          30% {
            opacity: 1;
          }
          40% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
        .base {
          position: absolute;
          right: -40px;
          height: 4px;
          width: 64px;
        }
        .dot {
          position: absolute;
          top: 0;
          height: 4px;
          width: 4px;
          border-radius: 2px;
          left: 60px;
          animation: movement 3s cubic-bezier(0, 0.5, 1, 0.5) infinite, opacity 3s linear infinite;
        }
        .dot-pt1 {
          left: 64px;
          animation-delay: 0.15s;
        }
        .dot-pt2 {
          left: 68px;
          animation-delay: 0.3s;
        }
      `}</style>
      <div className="dot dot-pt0" style={{ backgroundColor }} />
      <div className="dot dot-pt1" style={{ backgroundColor }} />
      <div className="dot dot-pt2" style={{ backgroundColor }} />
    </div> : null
  }

}

