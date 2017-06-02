
import React from 'react';
import PropTypes from 'prop-types';

import If from '../If';

export default class AppProgressCircular extends React.PureComponent {

  static propTypes = {
    active: PropTypes.bool,
  }

  static defaultProps = {
    active: false,
  }

  render() {
    const { active } = this.props;
    return <If condition={active}>
      <div className="circle">
        <style jsx>{`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(180deg);
            }
            100% {
             transform: rotate(360deg);
            }
          }
          .circle {
            height: 26px;
            width: 26px;
            border: 2px solid #d6dddb;
            border-bottom-color: transparent;
            border-radius: 26px;
            background: transparent !important;
            display: inline-block;
            animation: rotate 0.75s 0s linear infinite;
          }
        `}</style>
      </div>
    </If>
  }

}
