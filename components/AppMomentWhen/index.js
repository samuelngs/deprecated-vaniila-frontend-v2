
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import isToday from 'date-fns/is_today';

export default class AppMomentWhen extends React.PureComponent {

  static propTypes = {

    // color for everything
    color   : PropTypes.string,

    // if fill, set tint color
    fill    : PropTypes.bool,
    tint    : PropTypes.string,

    current : PropTypes.object,
    moments : PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {

    color   : '#185be7',

    fill    : true,
    tint    : '#fff',

    current : null,
    moments : [ ],
  }

  willEnter = o => {
    return { opacity: 0, y: 10 }
  }

  willLeave = o => {
    return { opacity: spring(0), y: spring(-10) }
  }

  getDefaultStyles = o => {
    const { current, moments } = this.props;
    const now = new Date();
    return moments
      .filter(n => n === current && n.when)
      .map(o => {
        const when = new Date(o.when);
        const date = isToday(when)
          ? 'Today'
          : `${distanceInWordsStrict(when, now)} ago`
        return { key: o.id, data: { date, when: this.getTime(o) }, style: { opacity: 0, y: 10 } }
      });
  }

  getStyles = o => {
    const { current, moments } = this.props;
    const now = new Date();
    return moments
      .filter(n => n === current && n.when)
      .map(o => {
        const when = new Date(o.when);
        const date = isToday(when)
          ? 'Today'
          : `${distanceInWordsStrict(when, now)} ago`
        return { key: o.id, data: { date, when: this.getTime(o) }, style: { opacity: spring(1), y: spring(0) } }
      });
  }

  getTime(moment) {
    const { when } = moment;
    if ( !when ) {
      return null;
    }
    const date = new Date(when);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  render() {
    const { color, fill, tint } = this.props;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { items => <div>
        <style jsx>{`
          .base {
            position: absolute;
            margin: 0;
            height: 18px;
            padding-top: 0px;
            padding-bottom: 0px;
            padding-left: 4px;
            padding-right: 4px;
            display: flex;
            align-items: center;
            border-width: 1px;
            border-style: solid;
            border-color: #000;
            border-radius: 3px;
            white-space: nowrap;
          }
          .base-fill {
            border: none;
            padding-top: 1px;
            padding-bottom: 1px;
            padding-left: 5px;
            padding-right: 5px;
          }
          .when {
            font-size: 12px;
            font-weight: 600;
            color: #000;
          }
        `}</style>
        { items.map(({ key, data, data: { date, when }, style }) => data && <div key={key} className={ fill ? "base base-fill" : "base" } style={{ borderColor: color, backgroundColor: fill && color, opacity: style.opacity, transform: `translate3d(0px, ${style.y}px, 0px)` }}>
          <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="5 0 80 60" style={{ stroke: ( fill ? tint : color ) }}>
            <path className="wave" d="M 0 37.5 c 7.684299348848887 0 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15" />
          </svg>
          <span className="when" style={{ color: ( fill ? tint : color ) }}>{ key === 'cover' ? date : when }</span>
        </div>) }
      </div> }
    </TransitionMotion>

  }

}
