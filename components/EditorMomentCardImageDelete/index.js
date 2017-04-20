
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 36px; width: 36px; fill: #fa674d; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
  <path d="M10.1 29.2l19.1-19.1c.2-.2.5-.2.7 0 .2.2.2.5 0 .7L10.8 29.9c-.2.2-.5.2-.7 0-.1-.2-.1-.5 0-.7z"/>
  <path d="M10.8 10.1l19.1 19.1c.2.2.2.5 0 .7-.2.2-.5.2-.7 0L10.1 10.8c-.2-.2-.2-.5 0-.7.2-.1.5-.1.7 0z"/>
</svg>



