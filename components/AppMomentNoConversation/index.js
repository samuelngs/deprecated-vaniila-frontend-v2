
import React from 'react';

export default class AppMomentNoConversation extends React.PureComponent {

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 18px;
          padding-bottom: 18px;
          padding-left: 0;
          padding-right: 0;
          min-height: 110px;
        }
        h4 {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          font-size: 16px;
          font-weight: 500;
          color: #53575d;
          display: flex;
          align-items: center;
        }
        p {
          margin-top: 10px;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          max-width: 240px;
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.3;
          color: #8b969a;
        }
        .icon {
          width: 18px;
          height: 18px;
          margin-left: 4px;
        }
      `}</style>
      <h4>No comments <img className="icon" src="/static/emoji/2x/1f62d.png" /></h4>
      <p>No one has made any comments in this moment yet.</p>
    </div>
  }

}


