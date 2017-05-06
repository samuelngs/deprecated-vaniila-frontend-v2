
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class MomentCardImageProgress extends React.PureComponent {

  static propTypes = {
    active    : PropTypes.bool,
    progress  : PropTypes.number,
  }

  static defaultProps = {
    active    : false,
    progress  : 0,
  }

  render() {
    const { active, progress } = this.props;
    return active ? <div className="base">
      <style jsx>{`
        .base {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%);
          height: 4px;
          width: 50%;
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        .progress {
          width: 0%;
          height: 4px;
          background-color: #75d1ff;
          transition: width .5s ease;
        }
      `}</style>
      <div className="progress" style={{ width: `${progress}%` }} />
    </div> : null
  }

}
