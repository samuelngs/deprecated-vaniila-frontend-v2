
import React from 'react';
import PropTypes from 'prop-types';

export default class AppLiveIndicator extends React.PureComponent {

  static propTypes = {

    // color for everything
    color: PropTypes.string,

    // if fill, set tint color
    fill : PropTypes.bool,
    tint : PropTypes.string,
  }

  static defaultProps = {
    color: '#185be7',

    fill : true,
    tint : '#fff',
  }

  render() {
    const { color, fill, tint } = this.props;
    return <div className={ fill ? "base base-fill" : "base" } style={{ borderColor: color, backgroundColor: fill && color }}>
      <style jsx>{`
        .base {
          margin: 0;
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
        }
        .base-fill {
          border: none;
          padding-top: 1px;
          padding-bottom: 1px;
          padding-left: 5px;
          padding-right: 5px;
        }
        .svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: #000;
          stroke-width: 6;
          stroke-linecap: round;
        }
        .wave {
          stroke-dasharray: 0 16 101 16;
          animation: wave 2400ms linear infinite;
        }
        .live {
          margin-top: 2px;
          margin-left: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #000;
        }
        @keyframes wave {
          0% {
            stroke-dashoffset: 0;
            transform: translate3d(0, 0, 0);
          }
          100% {
            stroke-dashoffset: -133;
            transform: translate3d(-90px, 0, 0);
          }
        }
      `}</style>
      <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="5 0 80 60" style={{ stroke: ( fill ? tint : color ) }}>
        <path className="wave" d="M 0 37.5 c 7.684299348848887 0 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15 s 7.172012725592294 15 15 15 s 7.172012725592294 -15 15 -15" />
      </svg>
      <span className="live" style={{ color: ( fill ? tint : color ) }}>LIVE</span>
    </div>
  }

}
