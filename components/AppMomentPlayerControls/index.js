
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

import AppMomentPlayerLiveProgressbar from '../AppMomentPlayerLiveProgressbar';
import AppMomentPlayerProgressbar from '../AppMomentPlayerProgressbar';
import AppMomentPlayerTimer from '../AppMomentPlayerTimer';
import AppMomentPlayerHighlights from '../AppMomentPlayerHighlights';

const active   = [ { key: 'player-control' } ];
const inactive = [ ];

export default class AppMomentPlayerControls extends React.PureComponent {

  static propTypes = {
    live      : PropTypes.bool,
    active    : PropTypes.bool,
    current   : PropTypes.object,
    moments   : PropTypes.arrayOf(PropTypes.string),
    doc       : PropTypes.object,
    begins    : PropTypes.number,
    ends      : PropTypes.number,
    onTo      : PropTypes.func,
  }

  static defaultProps = {
    live      : false,
    active    : false,
    current   : { },
    moments   : [ ],
    doc       : { },
    begins    : -1,
    ends      : -1,
    onTo      : e => null,
  }

  state = {
    hoverProgress: 10,
    hoverOProgress: 10,
    hovered: false,
  }

  componentDidMount() {
    this.$$_mounted_$$ = true;
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
  }

  handleMouseEnter = e => {
    const x = e.pageX || e.clientX;
    const target = e.currentTarget || e.target;
    const { left, right, width } = target.getBoundingClientRect();
    if ( x >= left && x <= right ) {
      const oprogress = ( x - left ) / width * 100;
      const progress = Math.round(oprogress);
      this.$$_mounted_$$ && this.setState({ hoverOProgress: oprogress, hoverProgress: progress, hovered: true });
    }
  }

  handleMouseMove = e => {
    this.handleMouseEnter(e);
  }

  handleMouseLeave = e => {
    this.$$_mounted_$$ && this.setState(state => state.hovered && { hovered: false });
  }

  handleMouseClick = e => {
    const { target } = e;
    const { hoverProgress, hoverOProgress, hovered } = this.state;
    const { doc, moments, onTo } = this.props
    if (!hovered || target.className === 'highlight') {
      return false
    }
    const isArray = Array.isArray(moments)
    if (!isArray || (isArray && moments.length === 0)) {
      return nil.arr
    }
    const { document } = doc || nil.obj
    const { data } = document || nil.obj
    const { slides } = data || nil.obj
    const steps = [ ]
    const goal = hoverProgress
    for (const key of moments) {
      const { when } = slides[key] || nil.obj
      const progress = this.getProgress(when)
      steps.push(progress)
    }
    const step = steps.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    const idx = steps.indexOf(step)
    const moment = moments[idx]
    onTo(e, moment)
  }

  willEnter = o => {
    return { opacity: 0 }
  }

  willLeave = o => {
    return { opacity: spring(0) }
  }

  getDefaultStyles = o => {
    const { active: visible, begins, ends } = this.props;
    const arr = visible && !(begins < 0 && ends < 0)
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { opacity: 0 } }));
  }

  getStyles = o => {
    const { active: visible, begins, ends } = this.props;
    const arr = visible && !(begins < 0 && ends < 0)
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

  getProgress(when) {
    const { current: { when: def }, begins, ends } = this.props;
    if (!when) when = def
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

    const { begins, ends, live, moments, doc, onTo } = this.props;
    const { hovered, hoverProgress } = this.state;

    const time = this.getHoverTime();
    const progress = this.getProgress();

    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => styles.length > 0 ? <div
        ref={n => this.n = n}
        className={ live ? "base base-active" : "base" }
        style={{ opacity: styles[0].style.opacity }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
        onClick={this.handleMouseClick}
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
          .base.base-active {
            right: 80px;
          }
          .timeline {
            position: relative;
            height: 4px;
            width: 100%;
            border-radius: 2px;
            background-color: rgba(0, 0, 0, 0.04);
          }
        `}</style>
        <div className="timeline">
          <AppMomentPlayerProgressbar active={hovered} progress={hoverProgress} />
          <AppMomentPlayerProgressbar active={true} animated={true} progress={progress} color="rgba(120, 120, 120, 0.4)" />
          <AppMomentPlayerLiveProgressbar active={live} />
          <AppMomentPlayerTimer active={hovered} progress={hoverProgress}>{ time }</AppMomentPlayerTimer>
          <AppMomentPlayerHighlights active={true} begins={begins} ends={ends} moments={moments} doc={doc} onTo={onTo} />
        </div>
      </div> : null }
    </TransitionMotion>
  }

}
