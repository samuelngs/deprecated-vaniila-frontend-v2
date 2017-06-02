
import React from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const active   = [ { key: 'control' } ];
const inactive = [ ];

export default class AppMomentNext extends React.PureComponent {

  static propTypes = {
    modal   : PropTypes.bool,
    active  : PropTypes.bool,
    onPress : PropTypes.func,
  }

  static defaultProps = {
    modal   : false,
    active  : false,
    onPress : null,
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

  render() {
    const { modal, onPress } = this.props;
    return <TransitionMotion
      defaultStyles={this.getDefaultStyles()}
      styles={this.getStyles()}
      willLeave={this.willLeave}
      willEnter={this.willEnter}>
      { styles => styles.length > 0 ? <button className={ modal ? "button button-modal" : "button" } onClick={onPress} style={{ opacity: styles[0].style.opacity }}>
        <style jsx>{`
          .button {
            position: absolute;
            top: 0;
            bottom: 0;
            right: -60px;
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 0;
            margin-right: 0;
            padding-top: 0;
            padding-bottom: 0;
            padding-left: 0px;
            padding-right: 0px;
            background-color: transparent;
            border: none;
            cursor: pointer;
            outline: none;
            display: none;
          }
          .button-modal {
            right: 10px;
          }
          .button-modal .svg {
            background-color: transparent;
            fill: #60696d;
          }
          .svg {
            margin-top: 0;
            margin-bottom: 0;
            margin-left: 0;
            margin-right: 0;
            padding-top: 16px;
            padding-bottom: 16px;
            padding-left: 16px;
            padding-right: 16px;
            width: 24px;
            height: 24px;
            fill: #999;
            border-radius: 50px;
          }
          @media (min-width: 768px) {
            .button {
              display: initial;
            }
          }
        `}</style>
        <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M26.22 94.724c1.565 1.565 4.102 1.565 5.67 0l41.89-41.89c1.564-1.565 1.564-4.102 0-5.667L31.89 5.277c-.785-.785-1.81-1.177-2.835-1.177s-2.052.39-2.836 1.174c-1.566 1.565-1.566 4.102 0 5.667L65.28 50 26.222 89.057c-1.564 1.565-1.564 4.102-.002 5.667z"/>
        </svg>
      </button> : null }
    </TransitionMotion>
  }

}


