
import React from 'react';

export default ({ err, retry }) => err ? <div className="base">
  <style jsx>{`
    .base {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 0;
      margin-right: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 160px;
      height: 160px;
      margin: 20px;
    }
    h2 {
      margin-top: 20px;
      margin-bottom: 0;
      margin-left: 0;
      margin-right: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      font-size: 16px;
      font-weight: 600;
      color: #4f6369;
    }
    p {
      margin-top: 20px;
      margin-bottom: 0;
      margin-left: 0;
      margin-right: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      width: 400px;
      max-width: calc(100% - 80px);
      font-size: 14px;
      font-weight: 300;
      text-align: center;
      line-height: 1.4;
      color: #8492a6;
    }
    button {
      outline: none;
      margin-top: 20px;
      margin-bottom: 0;
      margin-left: 0;
      margin-right: 0;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 14px;
      padding-right: 14px;
      border: none;
      border-radius: 3px;
      background-color: #00ce8b;
      font-size: 14px;
      font-weight: 400;
      color: #fff;
    }
    @media (min-width: 600px) {
      img { width: 200px; height: 200px; }
      h2 { font-size: 22px; }
      p { font-size: 18px; }
      button { padding-top: 12px; padding-bottom: 12px; font-size: 16px; font-weight: 300; }
    }
  `}</style>
  <img className="no-select" draggable={false} src="/static/server/500@4x.png" alt="The connection to the server failed" />
  <h2>The connection to the server failed</h2>
  <p>We had trouble connecting to server, please try again in a few minutes.</p>
  { retry && <button className="no-select" onClick={retry}>Ah, give it another shot!?</button> }
</div> : null;

