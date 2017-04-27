
import React from 'react';
import PropTypes from 'prop-types';

import { Motion, spring } from 'react-motion';

export default class Tooltip extends React.Component {

  static propTypes = {
    tag         : PropTypes.string,
    title       : PropTypes.string,
    description : PropTypes.string,
    render      : PropTypes.node,
    position    : PropTypes.oneOf(['top', 'bottom']),
  }

  static defaultProps = {
    tag         : '',
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

  onEnter(e) {
    this.setState({ active: true });
  }

  onLeave(e) {
    this.setState({ active: false });
  }

  renderTips(title, description, render) {
    if ( typeof render === 'function' ) {
      return render();
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
    const { tag: HTMLTag, title, description, render, position, className, children, ...props } = this.props;
    const { active } = this.state;
    return <HTMLTag { ...props } className={className ? `tooltip no-select ${className}` : 'tooltip no-select'} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
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
      <Motion style={{ y: spring(active ? 10 : 15), opacity: spring(active ? 1 : 0) }}>
        {({ y, opacity }) => <div className="tooltip-overlay" style={position === 'top' ? { bottom: `calc(100% + ${y}px)`, opacity } : { top: `calc(100% + ${y}px)`, opacity }}>
          <div className={ position === 'bottom' ? 'tooltip-arrow-pt' : 'tooltip-arrow-pb' } />
          { this.renderTips(title, description, render) }
        </div> }
      </Motion>
      { children }
    </HTMLTag>
  }

}
