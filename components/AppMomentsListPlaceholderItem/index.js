
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
          width: 300px;
          height: 360px;
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
        .item-cover-separator {
          top: 300px;
          left: 0;
          right: 0;
          width: 300px;
          height: 20px;
        }
        .item-details-s-f {
          top: 332px;
          left: 0;
          right: 0;
          width: 300px;
          height: 4px;
        }
        .item-details-s-s {
          top: 346px;
          left: 0;
          right: 0;
          width: 300px;
          height: 14px;
        }
        .item-details-s-t {
          top: 320px;
          right: 0;
          width: 90px;
          height: 26px;
        }
        .item-details-s-l {
          top: 336px;
          right: 90px;
          width: 40px;
          height: 26px;
        }
        @media (min-width: 680px) {
          .item { flex-basis: calc(50% - 20px); }
          .item + .item { margin-left: 20px; }
          .item:nth-child(2n + 1) { margin-left: 0px; }
        }
        @media (min-width: 1000px) {
          .item { flex-basis: calc(33.3% - 20px); }
          .item:nth-child(2n + 1) { margin-left: 20px; }
          .item:nth-child(3n + 1) { margin-left: 0px; }
        }
      `}</style>
      <style jsx global>{`
        @media (min-width: 680px) {
          .moments-list-item { flex-basis: calc(50% - 20px); }
          .moments-list-item + .moments-list-item { margin-left: 20px; }
          .moments-list-item:nth-child(2n + 1) { margin-left: 0px; }
        }
        @media (min-width: 1000px) {
          .moments-list-item { flex-basis: calc(33.3% - 20px); }
          .moments-list-item:nth-child(2n + 1) { margin-left: 20px; }
          .moments-list-item:nth-child(3n + 1) { margin-left: 0px; }
        }
      `}</style>
      <div className="item-mask item-cover-separator" />
      <div className="item-mask item-details-s-f" />
      <div className="item-mask item-details-s-s" />
      <div className="item-mask item-details-s-t" />
      <div className="item-mask item-details-s-l" />
    </li>
  }

}


