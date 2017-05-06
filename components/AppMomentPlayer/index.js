
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

import AppLiveIndicator from '../AppLiveIndicator';
import AppMomentPulse from '../AppMomentPulse';
import AppMomentPrevious from '../AppMomentPrevious';
import AppMomentNext from '../AppMomentNext';
import AppMomentPlayerControls from '../AppMomentPlayerControls';
import MomentCard from '../MomentCard';

export default class AppMomentPlayer extends React.Component {

  static propTypes = {
    id          : PropTypes.string,
    live        : PropTypes.bool,
    pulse       : PropTypes.bool,
    moment      : PropTypes.object,
    nextMoment  : PropTypes.object,
    prevMoment  : PropTypes.object,
    sizes       : PropTypes.object,
    hasPrevious : PropTypes.bool,
    hasNext     : PropTypes.bool,
    onPrevious  : PropTypes.func,
    onNext      : PropTypes.func,
  }

  static defaultProps = {
    id          : '',
    live        : false,
    pulse       : false,
    moment      : { },
    sizes       : { },
    hasPrevious : false,
    hasNext     : false,
    onPrevious  : e => null,
    onNext      : e => null,
  }

  state = {
    hover: false,
  }

  onPlayerEnter = e => {
    this.setState(state => !state.hover && { hover: true });
  }

  onPlayerLeave = e => {
    this.setState(state => state.hover && { hover: false });
  }

  willEnter = o => {
    return { opacity: 0 }
  }

  willLeave = o => {
    return { opacity: spring(0) }
  }

  getDefaultStyles = o => {

    const {
      nextMoment,
      prevMoment,
      moment,
    } = this.props;

    return [ prevMoment, moment, nextMoment ]
      .filter(n => !!n)
      .map(o => ({
        key   : o.id,
        data  : o,
        style : { opacity: 0 }
      }));
  }

  getStyles = o => {

    const {
      nextMoment,
      prevMoment,
      moment,
    } = this.props;

    return [ prevMoment, moment, nextMoment ]
      .filter(n => !!n)
      .map(o => ({
        key   : o.id,
        data  : o,
        style : { opacity: spring(
          o === moment
          ? 1
          : 0
        ) }
      }));
  }

  render() {

    const {

      id: root,

      moment,
      live,
      pulse,
      sizes: { player: { width, height, ratio, mode } },

      hasPrevious,
      hasNext,
      onPrevious,
      onNext,

    } = this.props;

    const { hover } = this.state;

    return <div
      className="base"
      style={{ width, height }}
      onMouseEnter={this.onPlayerEnter}
      onMouseLeave={this.onPlayerLeave}
      onMouseMove={this.onPlayerEnter}
    >
      <style jsx>{`
        .base {
          position: relative;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: auto;
          margin-right: auto;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          max-width: 100%;
          max-height: calc(100vh - 47px);
        }
        .live-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 20;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .player {
          position: relative;
          box-shadow: none;
          overflow: hidden;
        }
      `}</style>

      <div className="live-indicator">
        <AppMomentPulse color="rgba(127, 127, 127, 0.8)" active={live && pulse} />
        { live && <AppLiveIndicator color="rgba(127, 127, 127, 0.5)" fill={true} tint="#fff" /> }
      </div>

      <TransitionMotion
        defaultStyles={this.getDefaultStyles()}
        styles={this.getStyles()}
        willLeave={this.willLeave}
        willEnter={this.willEnter}>
        { cards => <div className="player" style={{ width, height }}>
          { cards.map(({ key, data: { id }, data: moment, style: { opacity } }, i) => <MomentCard
            key={key}
            root={root}
            id={id}
            x={0}
            y={0}
            scale={ratio}
            width={width}
            height={height}
            player={true}
            editmode={false}
            moment={moment}
            opacity={opacity}
          />) }
        </div> }
      </TransitionMotion>

      <AppMomentPrevious active={mode === 'desktop' && hover && hasPrevious} onPress={onPrevious} />
      <AppMomentNext active={mode === 'desktop' && hover && hasNext} onPress={onNext} />

      <AppMomentPlayerControls />
    </div>;
  }

}

