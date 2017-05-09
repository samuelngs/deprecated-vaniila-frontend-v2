
import React from 'react';

export default ({ modal, sizes, loading, children }) => loading ? <div className={ modal ? "base base-modal" : "base" }>
  <style jsx>{`
    @keyframes movement {
      0% {
        transform: translateX(0);
      }
      40% {
        transform: translateX(-120px);
      }
      100% {
        transform: translateX(-120px);
      }
    }
    @keyframes opacity {
      0% {
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      30% {
        opacity: 1;
      }
      40% {
        opacity: 0;
      }
      100% {
        opacity: 0;
      }
    }
    .base {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }
    .base-modal {
    }
    .container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
    .logo {
      position: relative;
      width: 100px;
      height: 48px;
    }
    .line {
      position: absolute;
      background-color: #ddd;
      height: 6px;
      border-radius: 3px;
      animation: movement 3s cubic-bezier(0, 0.5, 1, 0.5) infinite, opacity 3s linear infinite;
    }
    .line-pt1 {
      top: 0;
      left: 60px;
      width: 16px;
    }
    .line-pt2 {
      top: 0;
      left: 76px;
      width: 56px;
      animation-delay: 0.15s;
    }
    .line-pt3 {
      top: 0;
      left: 132px;
      width: 29px;
      animation-delay: 0.3s;
    }
    .line-pt4 {
      top: 14px;
      left: 64px;
      width: 46px;
    }
    .line-pt5 {
      top: 14px;
      left: 110px;
      width: 54px;
      animation-delay: 0.15s;
    }
    .line-pt6 {
      top: 28px;
      left: 60px;
      width: 28px;
    }
    .line-pt7 {
      top: 28px;
      left: 88px;
      width: 62px;
      animation-delay: 0.15s;
    }
    .line-pt8 {
      top: 28px;
      left: 150px;
      width: 10px;
      animation-delay: 0.3s;
    }
    .line-pt9 {
      top: 42px;
      left: 60px;
      width: 76px;
    }
    .line-pt10 {
      top: 42px;
      left: 136px;
      width: 30px;
      animation-delay: 0.15s;
    }
  `}</style>
  <div className="container" style={ !modal && { width: sizes.player.width, height: sizes.player.height }}>
    <div className="logo">
      <div className="line line-pt1" />
      <div className="line line-pt2" />
      <div className="line line-pt3" />
      <div className="line line-pt4" />
      <div className="line line-pt5" />
      <div className="line line-pt6" />
      <div className="line line-pt7" />
      <div className="line line-pt8" />
      <div className="line line-pt9" />
      <div className="line line-pt10" />
    </div>
  </div>
</div> : null;

