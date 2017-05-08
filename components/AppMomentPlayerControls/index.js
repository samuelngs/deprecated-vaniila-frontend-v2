
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

import AppMomentPlayerProgressbar from '../AppMomentPlayerProgressbar';
import AppMomentPlayerTimer from '../AppMomentPlayerTimer';

const active   = [ { key: 'player-control' } ];
const inactive = [ ];

export default class AppMomentPlayerControls extends React.PureComponent {

  static propTypes = {
    active  : PropTypes.bool,
    current : PropTypes.object,
    begins  : PropTypes.number,
    ends    : PropTypes.number,
  }

  static defaultProps = {
    active  : false,
    current : { },
    begins  : -1,
    ends    : -1,
  }

  state = {
    hoverProgress: 10,
    hoverOProgress: 10,
    hovered: false,
  }

  handleMouseEnter = e => {
    const x = e.pageX || e.clientX;
    const { left, right, width } = e.target.getBoundingClientRect();
    if ( x >= left && x <= right ) {
      const oprogress = ( x - left ) / width * 100;
      const progress = Math.round(oprogress);
      this.setState({ hoverOProgress: oprogress, hoverProgress: progress, hovered: true });
    }
  }

  handleMouseMove = e => {
    this.handleMouseEnter(e);
  }

  handleMouseLeave = e => {
    this.setState(state => state.hovered && { hovered: false });
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

  getUnits() {
    const { hoverOProgress } = this.state;
    const { begins, ends } = this.props;
    const milliseconds = (ends - begins);
    const unit = milliseconds / 100;
    const time = begins + Math.round(unit * hoverOProgress);
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return { milliseconds, unit, hours, minutes, seconds, ampm };
  }

  getProgress() {
    const { current: { when }, begins, ends } = this.props;
    const { unit } = this.getUnits();
    if ( when > ends ) return 100;
    if ( when < begins ) return 0;
    const progress = ( when - begins ) / unit;
    return progress > 100 ? 100 : progress;
  }

  getMomentTime() {
    const { current: { when } } = this.props;
    const date = new Date(when);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  getHoverTime() {
    const { hours, minutes, seconds, ampm } = this.getUnits();
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  render() {

    const { hovered, hoverProgress } = this.state;

    const time = hovered
      ? this.getHoverTime()
      : this.getMomentTime();

    const progress = this.getProgress();

    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => styles.length > 0 ? <div
        ref={n => this.n = n}
        className="base"
        style={{ opacity: styles[0].style.opacity }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
      >
        <style jsx>{`
          .base {
            display: flex;
            align-items: center;
            position: absolute;
            left: 40px;
            right: 40px;
            bottom: 25px;
            height: 20px;
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 0;
            margin-right: 0;
            padding-top: 0;
            padding-bottom: 0;
            padding-left: 0;
            padding-right: 0;
            cursor: pointer;
          }
          .timeline {
            position: relative;
            height: 4px;
            width: 100%;
            border-radius: 2px;
            background-color: rgba(0, 0, 0, 0.04);
            pointer-events: none;
          }
        `}</style>
        <div className="timeline">
          <AppMomentPlayerProgressbar active={hovered} progress={hoverProgress} />
          <AppMomentPlayerProgressbar active={true} animated={true} progress={progress} color="rgba(89, 183, 255, .9)" />
          <AppMomentPlayerTimer color={hovered ? 'rgba(0, 0, 0, 0.4)' : 'rgba(89, 183, 255, .9)'} active={true} progress={hovered ? hoverProgress : progress}>{ time }</AppMomentPlayerTimer>
        </div>
      </div> : null }
    </TransitionMotion>
  }

}
