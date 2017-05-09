
import React from 'react';

export default class AppMomentCommentPlaceholder extends React.PureComponent {

  render() {
    return <div className="comment-placeholder">
      <style jsx>{`
        @keyframes placeholder{
          0%   { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
        .comment-placeholder {
          margin-top: 20px;
          margin-bottom: 0;
          margin-left: 20px;
          margin-right: 20px;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          height: 134px;
          position: relative;
          background: #f4f4f4;
          background: linear-gradient(to right, #f4f4f4 0%, #eee 20%, #f4f4f5 40%, #f4f4f5 100%);
          background-size: 800px 104px;
          animation-duration: 1.5s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: placeholder;
          animation-timing-function: linear;
        }
        .mask {
          position: absolute;
          background-color: #fff;
        }
        .mask-s-f {
          top: 38px;
          left: 0;
          right: 0;
          height: 10px;
        }
        .mask-s-s {
          top: 86px;
          left: 0;
          right: 0;
          height: 10px;
        }
        .mask-message-f {
          left: 40px;
        }
        .mask-message-f-t {
          top: 0;
          right: 0;
          height: 10px;
        }
        .mask-message-f-m {
          top: 17px;
          right: 0;
          height: 4px;
        }
        .mask-message-f-b {
          top: 28px;
          right: 0;
          height: 10px;
        }
        .mask-message-f-l {
          top: 10px;
          height: 28px;
          width: 10px;
        }
        .mask-message-f-r {
          left: initial;
          right: 0;
          top: 0;
          height: 30px;
          width: 40px;
        }
        .mask-message-f-rs {
          left: initial;
          right: 40px;
          top: 21px;
          height: 7px;
          width: 20px;
        }
        .mask-message-s {
          left: 40px;
        }
        .mask-message-s-t {
          top: 48px;
          right: 0;
          height: 10px;
        }
        .mask-message-s-m {
          top: 65px;
          right: 0;
          height: 4px;
        }
        .mask-message-s-b {
          top: 76px;
          right: 0;
          height: 10px;
        }
        .mask-message-s-l {
          top: 58px;
          height: 28px;
          width: 10px;
        }
        .mask-message-s-r {
          left: initial;
          right: 0;
          top: 48px;
          height: 30px;
          width: 40px;
        }
        .mask-message-s-rs {
          left: initial;
          right: 40px;
          top: 69px;
          height: 7px;
          width: 20px;
        }
        .mask-message-t {
          left: 40px;
        }
        .mask-message-t-t {
          top: 96px;
          right: 0;
          height: 10px;
        }
        .mask-message-t-m {
          top: 113px;
          right: 0;
          height: 4px;
        }
        .mask-message-t-b {
          top: 124px;
          right: 0;
          height: 10px;
        }
        .mask-message-t-l {
          top: 106px;
          height: 28px;
          width: 10px;
        }
        .mask-message-t-r {
          left: initial;
          right: 0;
          top: 96px;
          height: 30px;
          width: 40px;
        }
        .mask-message-t-rs {
          left: initial;
          right: 40px;
          top: 117px;
          height: 7px;
          width: 20px;
        }
      `}</style>
      <div className="mask mask-message-f mask-message-f-t" />
      <div className="mask mask-message-f mask-message-f-m" />
      <div className="mask mask-message-f mask-message-f-b" />
      <div className="mask mask-message-f mask-message-f-l" />
      <div className="mask mask-message-f mask-message-f-r" />
      <div className="mask mask-message-f mask-message-f-rs" />
      <div className="mask mask-s-f" />
      <div className="mask mask-message-s mask-message-s-t" />
      <div className="mask mask-message-s mask-message-s-m" />
      <div className="mask mask-message-s mask-message-s-b" />
      <div className="mask mask-message-s mask-message-s-l" />
      <div className="mask mask-message-s mask-message-s-r" />
      <div className="mask mask-message-s mask-message-s-rs" />
      <div className="mask mask-s-s" />
      <div className="mask mask-message-t mask-message-t-t" />
      <div className="mask mask-message-t mask-message-t-m" />
      <div className="mask mask-message-t mask-message-t-b" />
      <div className="mask mask-message-t mask-message-t-l" />
      <div className="mask mask-message-t mask-message-t-r" />
      <div className="mask mask-message-t mask-message-t-rs" />
    </div>
  }

}



