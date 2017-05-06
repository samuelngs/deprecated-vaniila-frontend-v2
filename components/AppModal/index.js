
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'modal-context' } ];
const inactive = [ ];

export default class AppModal extends React.PureComponent {

  static propTypes = {
    color   : PropTypes.string,
    theme   : PropTypes.oneOf(['light', 'dark']),
    active  : PropTypes.bool,
    dismiss : PropTypes.func,
    control : PropTypes.oneOfType([ PropTypes.bool, PropTypes.node ]),
    children: PropTypes.node,
  }

  static defaultProps = {
    color   : undefined,
    theme   : 'light',
    active  : false,
    dismiss : e => null,
    control : true,
    children: null,
  }

  componentWillUpdate({ active }) {
    switch ( active ) {
      case true:
        return this.addEventListener();
      case false:
        return this.removeEventListener();
    }
  }

  componentWillUnmount() {
    this.removeEventListener();
  }

  /**
   * add event listener to component
   */
  addEventListener() {
    if ( this.listen ) return;
    this.listen = true;
    window.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * remove event listener from component
   */
  removeEventListener() {
    if ( !this.listen ) return;
    this.listen = false;
    window.removeEventListener('keydown', this.handleKeydown);
  }

  /**
   * handle for keydown
   */
  handleKeydown = e => {
    const { active, dismiss } = this.props;
    if ( active && e.keyCode === 27 ) {
      return dismiss(e);
    }
  }

  /**
   * handler for dismiss
   */
  handleOnDismiss = e => {
    const { active, dismiss } = this.props;
    if ( active && e.target === this.shim ) {
      return dismiss(e);
    }
  }

  willEnter = o => {
    return { opacity: 0, y: 15 }
  }

  willLeave = o => {
    return { opacity: spring(0), y: spring(15) }
  }

  getDefaultStyles() {
    const { active: visible } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { y: 15, opacity: 0 } }));
  }

  getStyles() {
    const { active: visible } = this.props;
    const arr = visible
      ? active
      : inactive;
    return arr.map(o => ({ ...o, style: { y: spring(0), opacity: spring(1) } }));
  }

  renderModal({ key, style: { opacity, y } }) {
    const { active, dismiss, children, color: backgroundColor, theme, control } = this.props;
    return <div ref={n => this.shim = n} key={key} className={`shim shim-${theme} shim-${active ? 'active' : 'inactive'}`} style={{ opacity, backgroundColor }} onClick={this.handleOnDismiss}>
      <style jsx>{`
        .shim {
          margin: 0;
          padding: 0;
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 20;
          overflow: auto;
        }
        .shim-light {
          background: rgba(245, 247, 248, 0.85);
        }
        .shim-dark {
          background: rgba(62, 70, 73, 0.85);
        }
        .shim-inactive {
          pointer-events: none;
        }
        .modal {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 100%;
        }
        .control {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 30px;
          right: 30px;
          margin: 0;
          padding: 0;
          width: 60px;
          height: 60px;
          background-color: #f1fcfd;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          outline: none;
        }
        .icon {
          height: 36px;
          width: 36px;
          fill: #83c8e1;
          pointer-events: none;
        }
      `}</style>
      <div ref={n => this.modal = n} className="modal" style={{
        transform: `translate3d(-50%, calc(-50% + ${y}px), 0px)`
      }}>
        { children }
      </div>
      { control === true && <button className="control" onClick={dismiss}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="icon">
          <path d="M10.1 29.2l19.1-19.1c.2-.2.5-.2.7 0 .2.2.2.5 0 .7L10.8 29.9c-.2.2-.5.2-.7 0-.1-.2-.1-.5 0-.7z"/>
          <path d="M10.8 10.1l19.1 19.1c.2.2.2.5 0 .7-.2.2-.5.2-.7 0L10.1 10.8c-.2-.2-.2-.5 0-.7.2-.1.5-.1.7 0z"/>
        </svg>
      </button> }
      { !!control && control !== true && control }
    </div>
  }

  render() {
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { ([ modal, ...etc ]) => (
        modal ? this.renderModal(modal): null
      ) }
    </TransitionMotion>
  }

}
