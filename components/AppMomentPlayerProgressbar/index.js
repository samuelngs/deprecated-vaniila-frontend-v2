
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'player-progress' } ];
const inactive = [ ];

export default class AppMomentPlayerProgressbar extends React.PureComponent {

  static propTypes = {
    color   : PropTypes.string,
    active  : PropTypes.bool,
    animated: PropTypes.bool,
    progress: PropTypes.number,
  }

  static defaultProps = {
    color   : 'rgba(100, 100, 100, .14)',
    active  : false,
    animated: false,
    progress: 0,
  }

  willEnter = o => {
    const { progress } = this.props;
    return { opacity: 0, width: progress }
  }

  willLeave = o => {
    const { progress } = this.props;
    return { opacity: spring(0), width: spring(progress) }
  }

  getDefaultStyles = o => {
    const { active: visible, progress } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: 0, width: progress } }));
  }

  getStyles = o => {
    const { active: visible, progress } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: spring(1), width: spring(progress) } }));
  }

  render() {
    const { color, animated, progress } = this.props;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => styles.length > 0 ? <div
        className="base"
        style={{
          backgroundColor: color,
          opacity: styles[0].style.opacity,
          width: `${animated ? styles[0].style.width : progress}%`,
        }}
      >
        <style jsx>{`
          .base {
            position: absolute;
            height: 4px;
            width: 0%;
            border-radius: 2px;
            background-color: rgba(100, 100, 100, .14);
          }
        `}</style>
      </div> : null }
    </TransitionMotion>
  }

}

