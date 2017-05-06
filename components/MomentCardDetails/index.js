
import React from 'react';
import PropTypes from 'prop-types';

export default class MomentCardDetails extends React.PureComponent {

  static propTypes = {
    id          : PropTypes.string,
    no          : PropTypes.number,
    when        : PropTypes.number,
    total       : PropTypes.number,
    active      : PropTypes.bool,
  }

  static defaultProps = {
    id          : '',
    no          : 1,
    when        : -1,
    total       : 0,
    active      : false,
  }

  getTime() {
    const { when } = this.props;
    const date = new Date(when);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  render() {
    const { active, no, total, when } = this.props;
    return active && <div className="base" data-controls>
      <style jsx>{`
        .base {
          display: flex;
          flex-direction: column;
          position: absolute;
          height: 18px;
          padding-left: 10px;
          padding-right: 10px;
          top: 100%;
          top: calc(100% + 20px);
          left: 0;
          right: 0;
          color: #8a8a8a;
          font-size: .9em;
          font-weight: 300;
          z-index: 1;
        }
        .no {
          font-size: 1.1em;
          font-weight: 500;
          color: #000;
        }
        .when {
          margin-top: 4px;
          font-size: 1.0em;
          font-weight: 300;
          color: #8a8a8a;
        }
      `}</style>
      { no !== -1 && <h4 className="no" data-controls>{ no } of { total }</h4> }
      { when !== -1 && <div className="when" data-controls>
        { this.getTime() }
      </div> }
    </div>
  }

}

