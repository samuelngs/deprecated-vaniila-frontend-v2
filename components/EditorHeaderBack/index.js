
import React from 'react';

const onPressDefault = e => { };

export default ({ headerHeight, headerIconColor, onPress = onPressDefault }) => <button className="header-nav-button nav-button-back" style={{ height: headerHeight }} onClick={onPress}>
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
    .header-nav-button:hover {
      background-color: rgb(245, 245, 245);
    }
    .header-nav-button:active {
      background-color: rgb(239, 239, 239);
    }
    .nav-button-back {
      width: 40px;
    }
    .nav-button-back svg {
      height: 28px;
      width: 28px;
    }
  `}</style>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" style={{ fill: headerIconColor }}>
    <path d="M25 10.03782c-.1 0-.2 0-.3.1l-10 9.5c-.2.2-.2.5 0 .6l10 9.5c.2.2.5.2.6 0 .2-.2.2-.5 0-.6l-9.7-9.2 9.7-9.2c.2-.2.2-.5 0-.6-.1-.1-.2-.1-.3-.1z"/>
    <path d="M25 10.03782c-.1 0-.2 0-.3.1l-10 9.5c-.2.2-.2.5 0 .6l10 9.5c.2.2.5.2.6 0 .2-.2.2-.5 0-.6l-9.7-9.2 9.7-9.2c.2-.2.2-.5 0-.6-.1-.1-.2-.1-.3-.1z"/>
  </svg>
</button>
