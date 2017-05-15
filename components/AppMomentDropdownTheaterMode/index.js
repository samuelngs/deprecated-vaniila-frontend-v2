
import React from 'react';

export default class AppMomentDropdownTheaterMode extends React.PureComponent {

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
        <path d="M50 22C31.342 22 15.093 32.297 7 47.47c0 0-.674 1.346-.844 1.75-.1.237-.156.505-.156.78 0 .272.058.545.156.78.17.406.844 1.69.844 1.69C15.088 67.653 31.332 78 50 78s34.912-10.346 43-25.53c0 0 .675-1.284.844-1.69.098-.235.156-.508.156-.78 0-.275-.056-.543-.156-.78-.17-.404-.844-1.75-.844-1.75C84.907 32.296 68.658 22 50 22zm0 4c17.418 0 32.393 9.78 39.688 23.97C82.395 64.17 67.425 74 50 74c-17.426 0-32.396-9.83-39.688-24.03C17.608 35.78 32.582 26 50 26zm0 8c-8.813 0-16 7.187-16 16 0 8.813 7.187 16 16 16 8.813 0 16-7.187 16-16 0-8.813-7.187-16-16-16zm0 4c6.65 0 12 5.35 12 12s-5.35 12-12 12-12-5.35-12-12 5.35-12 12-12z"/>
      </svg>
      <span>Theater Mode</span>
    </div>
  }

}


