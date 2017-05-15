
import React from 'react';

export default class AppMomentDropdownEdit extends React.PureComponent {

  render() {
    return <div className="base">
      <style jsx>{`
        .base {
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: center;
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 0;
          margin-right: 0;
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .svg {
          fill: #777;
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
      `}</style>
      <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M73.53 18c-1.282 0-2.85.506-3.936 1.594l-37 37c-.35.344-.566.822-.594 1.312l-1 22C30.94 81.05 31.99 82 33 82l21.188-2c.458-.05.897-.263 1.218-.594l37-37c1.1-1.1 1.594-2.65 1.594-3.906 0-1.638-.67-2.974-1.594-3.906l-15-15C76.41 18.6 75.044 18 73.53 18zm0 4c.423 0 .85.193 1.064.406l15 15c.292.414.405.814.407 1.163.004.454-.183.824-.405 1.023L84 45.187 66.812 28l5.446-5.445c.437-.43.862-.555 1.273-.555zM64 30.813l3.656 3.687L40.5 61.656 36.812 58zm6.5 6.5l4.156 4.187L47.5 68.656 43.312 64.5zm7 7L81.188 48 54 75.188 50.312 71.5zm-41.72 18.31l13.782 13.78-14.468 1.377zM8 78c-1.108 0-2 .892-2 2s.892 2 2 2h14c1.108 0 2-.892 2-2s-.892-2-2-2z" />
      </svg>
      <span>Edit</span>
    </div>
  }

}

