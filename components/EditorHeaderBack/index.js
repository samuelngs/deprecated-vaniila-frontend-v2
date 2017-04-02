
import React from 'react';

export default ({ headerHeight, headerIconColor }) => <button className="header-nav-button nav-button-back" style={{ height: headerHeight }}>
  <style jsx>{`
    .header-nav-button {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 0;
      margin-right: 0;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;
      padding-right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      border: none;
      background-color: transparent;
      cursor: pointer;
    }
    .nav-button-back {
      width: 40px;
    }
    .nav-button-back svg {
      height: 12px;
      width: 12px;
    }
  `}</style>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ fill: headerIconColor }}>
    <path d="M74 100c-1.7 0-3.5-.6-4.9-1.8l-48-42.7c-3-2.7-3.3-7.3-.6-10.4 2.7-3 7.3-3.3 10.4-.6L79 87.1c3 2.7 3.3 7.3.6 10.4-1.5 1.7-3.5 2.5-5.6 2.5z" />
    <path d="M26 57.4c-2 0-4.1-.8-5.5-2.5-2.7-3-2.4-7.7.6-10.4L69.2 1.9c3-2.7 7.7-2.4 10.4.6s2.4 7.7-.6 10.4L30.8 55.5c-1.4 1.2-3.1 1.9-4.8 1.9z" />
  </svg>
</button>
