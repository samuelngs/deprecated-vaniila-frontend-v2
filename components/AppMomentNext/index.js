
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
            fill: #185be7;
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
            fill: #83c8e1;
            background-color: #f0fbfc;
            border-radius: 50px;
          }
          @media (min-width: 768px) {
            .button {
              display: initial;
            }
          }
        `}</style>
        <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M28.003 5.984a2 2 0 0 1 1.388.572l44 42a2 2 0 0 1 0 2.894l-44 42a2 2 0 1 1-2.76-2.894l42.485-40.553L26.63 9.45a2 2 0 0 1 1.373-3.466z"/>
        </svg>
      </button> : null }
    </TransitionMotion>
  }

}


