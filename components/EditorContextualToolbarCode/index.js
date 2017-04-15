
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { height: 30px; width: 30px; fill: #fff; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
   <path d="M11 20.4c-.1.1-.3.2-.5.2s-.3-.1-.5-.2l-5.2-5c-.1-.1-.2-.3-.2-.5s.1-.4.2-.5l5.2-5c.3-.3.7-.2 1 0 .3.3.2.7 0 1L6.4 15l4.7 4.5c.2.2.2.7-.1.9zm5.7-10.2l-2.1 9.9c-.1.3-.3.5-.7.5h-.1c-.4-.1-.6-.4-.5-.8l2.1-9.9c.1-.4.4-.6.8-.5.3 0 .6.4.5.8zm8.6 4.8c0 .2-.1.4-.2.5l-5.2 5c-.1.1-.3.2-.5.2s-.4-.1-.5-.2c-.3-.3-.2-.7 0-1l4.6-4.5-4.5-4.5c-.3-.3-.3-.7 0-1 .3-.3.7-.3 1 0l5.2 5c0 .1.1.3.1.5z" />
</svg>

