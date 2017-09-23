
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'player-highlights' } ];
const inactive = [ ];

const nil = {
  obj: { },
  arr: { },
}

export default class AppMomentPlayerHighlights extends React.PureComponent {

  static propTypes = {
    color     : PropTypes.string,
    active    : PropTypes.bool,
    moments   : PropTypes.arrayOf(PropTypes.string),
    doc       : PropTypes.object,
    begins    : PropTypes.number,
    ends      : PropTypes.number,
    onTo      : PropTypes.func,
  }

  static defaultProps = {
    color     : 'rgba(0, 0, 0, 0.4)',
    active    : false,
    moments   : [],
    doc       : { },
    begins    : -1,
    ends      : -1,
    onTo      : e => null,
  }

  willEnter = o => ({ opacity: 0, y: -8, x: this.props.progress })
  willLeave = o => ({ opacity: spring(0), y: spring(-8), x: spring(this.props.progress) })

  jumpToMoment = (key) => {
    const { onTo } = this.props
    return (e) => onTo(e, key)
  }

  getProgress(when) {
    const { begins, ends } = this.props;
    const milliseconds = (ends - begins);
    const unit = milliseconds / 100;
    if ( when > ends ) return 100;
    if ( when < begins ) return 0;
    const progress = ( when - begins ) / unit;
    return progress > 100 ? 100 : progress;
  }

  getHighlights = () => {
    const { doc, moments } = this.props
    const isArray = Array.isArray(moments)
    if (!isArray || (isArray && moments.length === 0)) {
      return nil.arr
    }
    const { document } = doc || nil.obj
    const { data } = document || nil.obj
    const { slides } = data || nil.obj
    const res = [ ]
    lmoment:
    for (const key of moments) {
      const { data, when } = slides[key] || nil.obj
      const { blocks } = data || nil.obj
      if (Array.isArray(blocks) && blocks.length > 0) {
        const progress = this.getProgress(when)
        lblock:
        for (const block of blocks) {
          if (typeof block === 'object') {
            const { type } = block || nil.obj
            switch (type) {
              case 'header-one':
                res.push({ key, type: 1, progress })
                break lblock;
              case 'header-two':
                res.push({ key, type: 2, progress })
                break lblock;
            }
          }
        }
      }
    }
    return res
  }

  getDefaultStyles = o => {
    const { active: visible } = this.props;
    const highlights = this.getHighlights()
    const arr = visible
      ? highlights
      : inactive;
    return arr.map(({ key, type, progress }) => ({ key, data: type, style: { opacity: 0, y: -8, x: progress } }));
  }

  getStyles = o => {
    const { active: visible } = this.props;
    const highlights = this.getHighlights()
    const arr = visible
      ? highlights
      : inactive;
    return arr.map(({ key, type, progress }) => ({ key, data: type, style: { opacity: spring(1), y: spring(-10), x: spring(progress) } }));
  }

  render() {
    const { color, progress, animated } = this.props;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => styles.length > 0
        ? (
          <div className="base">
            <style jsx>{`
              .base {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: 2;
              }
              .highlight {
                position: absolute;
                top: 6px;
                height: 8px;
                width: 8px;
                border-radius: 10px;
                border: 2px solid #fff;
                background-color: #07d691;
                z-index: 3;
              }
              .highlight:hover {
                width: 10px;
                height: 10px;
                top: 5px;
              }
            `}</style>
            { styles.map(i => (
              <div
                key={i.key}
                className="highlight"
                style={{
                  opacity: i.style.opacity,
                  transform: `translate3d(-50%, ${i.style.y}px, 0)`,
                  left: `${i.style.x}%`,
                  backgroundColor: i.data === 1 ? '#07d691' : '#319aff',
                }}
                onClick={this.jumpToMoment(i.key)}
              />
            )) }
          </div>
        )
        : null
      }
    </TransitionMotion>
  }

}


