
import React from 'react';

export default class AppMomentLeaveComment extends React.PureComponent {

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          min-height: 48px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .input {
          flex: 1;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 4px;
          padding-bottom: 4px;
          padding-left: 10px;
          padding-right: 10px;
          border: none;
          outline: none;
          font-size: 14px;
          font-weight: 400;
          color: #53575d;
        }
        .input::placeholder {
          color: #bbb;
        }
      `}</style>
      <input
        type="text"
        placeholder="Add a comment..."
        className="input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  }

}
