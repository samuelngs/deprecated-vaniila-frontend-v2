
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'pulse' } ];
const inactive = [ ];

export default class AppMomentPulse extends React.Component {

  static propTypes = {
    active: PropTypes.bool,
    color : PropTypes.string,
  }

  static defaultProps = {
    active: false,
    color : '#fff',
  }

  willEnter = o => {
    return { opacity: 0 }
  }

  willLeave = o => {
    return { opacity: spring(0) }
  }

  getDefaultStyles = o => {
    const { active: visible } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: 0 } }));
  }

  getStyles = o => {
    const { active: visible } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: spring(1) } }));
  }

  render() {
    const { color: backgroundColor } = this.props;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => styles.length > 0 ? <div className="base" style={{ opacity: styles[0].style.opacity }}>
        <style jsx>{`
          .base {
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 0;
            margin-right: 8px;
            padding-top: 0;
            padding-bottom: 0;
            padding-left: 0;
            padding-right: 0;
          }
          .pulse {
            width: 4px;
            height: 4px;
            margin: 2px;
            border-radius: 2px;
            background-color: #fff;
            display: inline-block;
          }
          @keyframes ball-pulse-sync {
            50% {
              opacity: 0.5;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .pulse-first {
            animation: ball-pulse-sync 0.9s -0.14s infinite ease-in-out;
          }
          .pulse-second {
            animation: ball-pulse-sync 0.9s -70ms infinite ease-in-out;
          }
          .pulse-third {
            animation: ball-pulse-sync 0.9s 0s infinite ease-in-out;
          }
        `}</style>
        <div className="pulse pulse-first" style={{ backgroundColor }} />
        <div className="pulse pulse-second" style={{ backgroundColor }} />
        <div className="pulse pulse-third" style={{ backgroundColor }} />
      </div> : null }
    </TransitionMotion>
  }

}



