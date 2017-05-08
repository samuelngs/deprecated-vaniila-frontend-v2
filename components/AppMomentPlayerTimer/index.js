
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'player-timer' } ];
const inactive = [ ];

export default class AppMomentPlayerTimer extends React.PureComponent {

  static propTypes = {
    color   : PropTypes.string,
    active  : PropTypes.bool,
    animated: PropTypes.bool,
    progress: PropTypes.number,
    children: PropTypes.node,
  }

  static defaultProps = {
    color   : 'rgba(0, 0, 0, 0.4)',
    active  : false,
    animated: false,
    progress: 0,
    children: null,
  }

  willEnter = o => ({ opacity: 0, y: -8, x: this.props.progress })
  willLeave = o => ({ opacity: spring(0), y: spring(-8), x: spring(this.props.progress) })

  getDefaultStyles = o => {
    const { active: visible, progress } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: 0, y: -8, x: progress } }));
  }

  getStyles = o => {
    const { active: visible, progress } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: spring(1), y: spring(-10), x: spring(progress) } }));
  }

  render() {
    const { color, progress, animated, children } = this.props;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => styles.length > 0 ? <div
        className="base"
        style={{
          opacity: styles[0].style.opacity,
          transform: `translate3d(-50%, ${styles[0].style.y}px, 0)`,
          left: `${animated ? styles[0].style.x : progress}%`,
          backgroundColor: color,
        }}
      >
        <style jsx>{`
          .base {
            position: absolute;
            bottom: 100%;
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 0;
            margin-right: 0;
            padding-top: 5px;
            padding-bottom: 4px;
            padding-left: 6px;
            padding-right: 6px;
            border-radius: 2px;
            background-color: rgba(0, 0, 0, 0.4);
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            color: #fff;
            transform: translate3d(-50%, 0, 0);
            z-index: 2;
          }
          .arrow {
            position: absolute;
            bottom: -4px;
            left: 50%;
            width: 0;
            height: 0;
            transform: translateX(-50%);
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top-style: solid;
            border-top-width: 4px;
          }
        `}</style>
        <div className="arrow" style={{ borderTopColor: color }} />
        { children }
      </div> : null }
    </TransitionMotion>
  }

}


