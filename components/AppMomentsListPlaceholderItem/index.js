
import React from 'react';

export default class AppMomentsListPlaceholderItem extends React.PureComponent {

  render() {
    return <li className="item moments-list-item">
      <style jsx>{`
        @keyframes placeholder{
          0%   { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
        .item {
          position: relative;
          margin-top: 0;
          margin-bottom: 20px;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
          list-style: none;
          width: 100%;
          height: 410px;
          background: #f4f4f4;
          background: linear-gradient(to right, #eeeeee 0%, #e1e1e1 20%, #eeeeef 40%, #eeeeef 100%);
          background-size: 800px 104px;
          animation-duration: 1.5s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: placeholder;
          animation-timing-function: linear;
        }
        .item-mask {
          position: absolute;
          background-color: #fff;
        }
        .item-details-s-f {
          top: 0px;
          left: 0;
          right: 0;
          height: 14px;
        }
        .item-details-s-s {
          top: 14px;
          left: 36px;
          height: 36px;
          width: 14px;
        }
        .item-details-s-t {
          top: 30px;
          left: 50px;
          right: 0;
          height: 4px;
        }
        .item-details-s-l {
          top: 50px;
          left: 0;
          right: 0;
          height: 12px;
        }
        .item-details-s-o {
          top: 14px;
          left: 200px;
          right: 0;
          height: 16px;
        }
        .item-details-s-p {
          top: 34px;
          left: 192px;
          right: 0;
          height: 16px;
        }
        .item-details-s-y {
          top: 14px;
          left: 50px;
          height: 4px;
          width: 150px;
        }
        .item-details-s-u {
          top: 46px;
          left: 50px;
          width: 142px;
          height: 4px;
        }
        @media (min-width: 680px) {
          .item { height: 510px; }
        }
        @media (min-width: 1000px) {
          .item { height: 510px; }
        }
      `}</style>
      <div className="item-mask item-details-s-f" />
      <div className="item-mask item-details-s-s" />
      <div className="item-mask item-details-s-t" />
      <div className="item-mask item-details-s-l" />
      <div className="item-mask item-details-s-o" />
      <div className="item-mask item-details-s-p" />
      <div className="item-mask item-details-s-y" />
      <div className="item-mask item-details-s-u" />
    </li>
  }

}


