
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'tooltip-context' } ];
const inactive = [ ];

export default class Tooltip extends React.PureComponent {

  static propTypes = {
    tag         : PropTypes.string,
    offset      : PropTypes.number,
    title       : PropTypes.string,
    description : PropTypes.string,
    render      : PropTypes.node,
    position    : PropTypes.oneOf(['top', 'bottom']),
  }

  static defaultProps = {
    tag         : '',
    offset      : 0,
    title       : '',
    description : '',
    render      : null,
    position    : 'bottom',
  }

  state = {
    active: false,
  }

  constructor(props) {
    super(props);
    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  componentDidMount() {
    this.$$_mounted_$$ = true;
  }

  componentWillUnmount() {
    this.$$_mounted_$$ = false;
  }

  willEnter = o => {
    return { opacity: 0, y: 15 }
  }

  willLeave = o => {
    return { opacity: spring(0), y: spring(15) }
  }

  getDefaultStyles() {
    const { active: hovered } = this.state;
    const arr = hovered
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { y: 15, opacity: 0 } }));
  }

  getStyles() {
    const { active: hovered } = this.state;
    const arr = hovered
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { y: spring(10), opacity: spring(1) } }));
  }

  onEnter(e) {
    this.$$_mounted_$$ && this.setState({ active: true });
  }

  onLeave(e) {
    this.$$_mounted_$$ && this.setState({ active: false });
  }

  renderTips(title, description, render) {
    if ( typeof render === 'function' ) {
      return render();
    }
    if ( typeof render === 'object' && render !== null ) {
      return render;
    }
    return <div className="overlay no-select">
      <style jsx>{`
        .overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .title {
          padding-top: 1px;
          padding-bottom: 1px;
          font-size: 14px;
          font-weight: 500;
        }
        .description {
          padding-top: 1px;
          padding-bottom: 1px;
          font-size: 12px;
          font-weight: 300;
        }
      `}</style>
      <span className="title no-select">{ title }</span>
      { description && <span className="description no-select">{ description }</span> }
    </div>
  }

  render() {
    const { tag: HTMLTag, offset, title, description, render, position, className, children, ...props } = this.props;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={::this.willLeave}
      willEnter={::this.willEnter}>
      { ([ motion, ...etc ]) => <HTMLTag { ...props } className={className ? `tooltip no-select ${className}` : 'tooltip no-select'} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        <style jsx global>{`
          .tooltip {
            position: relative;
          }
          .tooltip-overlay {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            margin: 0;
            padding: 0;
            padding-top: 6px;
            padding-bottom: 6px;
            padding-left: 8px;
            padding-right: 8px;
            border-radius: 2px;
            background-color: rgba(0, 0, 0, 0.95);
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            font-weight: 400;
            color: #fff;
            white-space: nowrap;
            pointer-events: none;
            z-index: 5;
          }
          .tooltip-arrow-pt {
            position: absolute;
            top: -4px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid rgba(0, 0, 0, 0.95);
          }
          .tooltip-arrow-pb {
            position: absolute;
            bottom: -4px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid rgba(0, 0, 0, 0.95);
          }
        `}</style>
        { motion ? <div className="tooltip-overlay" style={position === 'top' ? { bottom: `calc(100% + ${motion.style.y}px)`, opacity: motion.style.opacity, left: !!offset && `calc(50% + ${offset}px)` } : { top: `calc(100% + ${motion.style.y}px)`, opacity: motion.style.opacity, left: !!offset && `calc(50% + ${offset}px)` }}>
          <div className={ position === 'bottom' ? 'tooltip-arrow-pt' : 'tooltip-arrow-pb' } style={{ right: !!offset && `calc(50% + ${offset + (offset < 0 ? -2.5 : 2.5)}px)` }} />
          { this.renderTips(title, description, render) }
        </div> : null }
        { children }
      </HTMLTag> }
    </TransitionMotion>
  }

}
