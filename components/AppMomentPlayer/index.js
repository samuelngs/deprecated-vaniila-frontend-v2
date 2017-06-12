
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

import If from '../If';
import AppLiveIndicator from '../AppLiveIndicator';
import AppMomentEdit from '../AppMomentEdit';
import AppMomentWhen from '../AppMomentWhen';
import AppMomentPulse from '../AppMomentPulse';
import AppMomentPrevious from '../AppMomentPrevious';
import AppMomentNext from '../AppMomentNext';
import AppMomentPlayerControls from '../AppMomentPlayerControls';
import MomentCard from '../MomentCard';

export default class AppMomentPlayer extends React.PureComponent {

  static propTypes = {
    id              : PropTypes.string,
    modal           : PropTypes.bool,
    live            : PropTypes.bool,
    pulse           : PropTypes.bool,
    permissions     : PropTypes.object,
    hover           : PropTypes.bool,
    begins          : PropTypes.number,
    ends            : PropTypes.number,
    moments         : PropTypes.arrayOf(PropTypes.string),
    moment          : PropTypes.object,
    momentIndex     : PropTypes.number,
    nextMoment      : PropTypes.object,
    nextMomentIndex : PropTypes.number,
    prevMoment      : PropTypes.object,
    prevMomentIndex : PropTypes.number,
    sizes           : PropTypes.object,
    hasPrevious     : PropTypes.bool,
    hasNext         : PropTypes.bool,
    onPrevious      : PropTypes.func,
    onNext          : PropTypes.func,
  }

  static defaultProps = {
    id              : '',
    modal           : false,
    live            : false,
    pulse           : false,
    permissions     : { },
    hover           : false,
    begins          : -1,
    ends            : -1,
    moments         : [ ],
    moment          : { },
    momentIndex     : -2,
    nextMoment      : { },
    nextMomentIndex : -2,
    prevMoment      : { },
    prevMomentIndex : -2,
    sizes           : { },
    hasPrevious     : false,
    hasNext         : false,
    onPrevious      : e => null,
    onNext          : e => null,
  }

  state = {
    sx: 0,
    cx: 0,
    touches: false,
  }

  handleTouchStart = e => {
    const { sizes: { player: { mode } } } = this.props;
    if ( mode !== 'mobile' ) return;

    const { target } = e;
    if ( target.hasAttribute('data-moment-control') ) return;

    e.cancelable && e.preventDefault && e.preventDefault();
    if ( window.scrollY !== 0 ) window.scrollTo(0, 0);

    const sx = e.targetTouches[0].pageX;
    const cx = sx;
    this.setState(state => !state.touches && { sx, cx, touches: true });
  }

  handleTouchMove = e => {
    const { sizes: { player: { width, mode } } } = this.props;
    const { touches } = this.state;
    if ( mode !== 'mobile' || !touches ) return;

    e.cancelable && e.preventDefault && e.preventDefault();
    if ( window.scrollY !== 0 ) window.scrollTo(0, 0);

    const cx = e.targetTouches[0].pageX;

    this.setState(state => state.touches && { cx });
  }

  handleTouchEnd = e => {
    const { sizes: { player: { width, mode } }, hasPrevious, hasNext, onPrevious, onNext } = this.props;
    const { touches, cx, sx } = this.state;
    if ( mode !== 'mobile' || !touches ) return;

    e.cancelable && e.preventDefault && e.preventDefault();
    if ( window.scrollY !== 0 ) window.scrollTo(0, 0);

    const dis = cx - sx;
    const abs = Math.abs(dis);
    if ( abs > width / 3 ) {
      if ( dis > 0 && hasPrevious ) {
        onPrevious();
      } else if ( dis < 0 && hasNext ) {
        onNext();
      }
    }
    this.setState(state => state.touches && { touches: false });
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

      hover,
      begins,
      ends,
      modal,
      moments,
      moment,
      momentIndex,
      nextMoment,
      prevMoment,
      permissions: { admin, write, read },
      live,
      pulse,
      sizes: { player: { width, height, ratio, mode } },

      hasPrevious,
      hasNext,
      onPrevious,
      onNext,

    } = this.props;

    const {
      touches,
      sx,
      cx,
    } = this.state;

    const { id, index, when } = moment;
    const draft = id === 'cover' && !nextMoment;

    const posx = ( ( momentIndex + 1 ) * width ) - ( cx - sx );

    return <div className="base" style={{ width, height }}>
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
        .event-when {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 20;
          display: flex;
          flex-direction: row;
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
        .moments {
          overflow-x: hidden;
          overflow-y: hidden;
          -ms-overflow-style: none;
          -ms-scroll-chaining: none;
          -ms-scroll-snap-type: mandatory;
          -ms-scroll-snap-points-x: snapInterval(0%, 100%);
        }
        .player {
          position: relative;
          box-shadow: none;
          transform: translate3d(0px, 0px, 0px);
          overflow: hidden;
        }
        .player-inactive {
          transition: transform 0.3s ease-out;
        }
      `}</style>

      <div className="event-when">
        <AppMomentWhen color="#000" fill={true} tint="#fff" current={moment} moments={[ prevMoment, moment, nextMoment ].filter(n => !!n)} />
      </div>

      <div className="live-indicator">
        <AppMomentPulse color="#59b7ff" active={live && pulse} />
        <If condition={live}>
          <AppLiveIndicator color="#82a3b7" fill={true} tint="#fff" />
        </If>
      </div>

      <div className="moments" style={{ width, height, touchAction: mode === 'desktop' ? 'initial' : 'none' }} onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willLeave={this.willLeave}
          willEnter={this.willEnter}>
          { cards => <div className={ !touches && mode === 'mobile' ? "player player-inactive" : "player" } style={ touches ? {
            width: mode === 'desktop' ? width : ( width * ( moments.length + 1 ) ),
            height,
            transform: mode === 'desktop' ? `translate3d(0, 0, 0)` : `translate3d(${-posx}px, 0, 0)`,
          } : {
            width: mode === 'desktop' ? width : ( width * ( moments.length + 1 ) ),
            height,
            transform: mode === 'desktop' ? `translate3d(0, 0, 0)` : `translate3d(-${(index + 1) * width}px, 0, 0)`,
          }}>
            { cards.map(({ key, data: { id, index }, data, style: { opacity } }, i) => <MomentCard
              key={key}
              root={root}
              id={id}
              x={mode === 'desktop' ? 0 : ( index + 1 ) * width}
              y={0}
              scale={ratio}
              width={width}
              height={height}
              player={true}
              editmode={false}
              moment={data}
              opacity={mode === 'desktop' ? opacity : 1}
              placeholder="There's nothing here, yet 🙌"
              visible={moment.id === id}
            />) }
          </div> }
        </TransitionMotion>
      </div>

      <AppMomentPrevious modal={(width >= 800 && live) || modal} active={mode === 'desktop' && hover && hasPrevious} onPress={onPrevious} />
      <AppMomentNext modal={(width >= 800 && live) || modal} active={mode === 'desktop' && hover && hasNext} onPress={onNext} />

      <AppMomentPlayerControls active={!draft && begins !== -1 && mode === 'desktop' && hover} begins={begins} ends={ends} live={live} current={moment} />
    </div>;
  }

}

