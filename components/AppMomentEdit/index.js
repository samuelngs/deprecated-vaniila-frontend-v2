
import React from 'react';

export default class AppMomentEdit extends React.PureComponent {

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 4px;
          padding-top: 0px;
          padding-bottom: 0px;
          padding-left: 4px;
          padding-right: 4px;
          height: 18px;
          display: flex;
          align-items: center;
          border-width: 1px;
          border-style: solid;
          border-color: #ddd;
          border-radius: 3px;
          cursor: pointer;
        }
        .text {
          margin-top: 2px;
          margin-left: 4px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #ccc;
        }
      `}</style>
      <span className="text">EDIT</span>
    </div>
  }

}

