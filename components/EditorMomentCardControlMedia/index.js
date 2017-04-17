
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={active ? "icon icon-active" : "icon"} >
  <style jsx>{`
    .icon { height: 18px; width: 18px; fill: #a8a8a8; pointer-events: none; }
    .icon-active { fill: #76FFB4; }
  `}</style>
    <path d="M6.5 2.73785c-.2 0-.3.1-.4.2l-1 2H1.6c-.9 0-1.6.7-1.6 1.6v7.3c0 .3.2.5.4.5s.5-.2.5-.4v-7.3c0-.4.3-.7.7-.7h3.9c.2 0 .3-.1.4-.3l1-2h6.3l1 2c.1.2.2.3.4.3h3.9c.4 0 .7.3.7.7v9.1c0 .4-.3.7-.7.7H1.6c-.4 0-.7-.3-.7-.7 0-.3-.2-.5-.4-.5s-.5.2-.5.4c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6v-9c0-.9-.7-1.6-1.6-1.6h-3.6l-1-2c-.1-.2-.2-.2-.4-.2H6.5c.1-.1.1-.1 0-.1zm3.5 4.1c-2.3 0-4.1 1.8-4.1 4.1s1.8 4.1 4.1 4.1 4.1-1.8 4.1-4.1-1.8-4.1-4.1-4.1zm0 .9c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.2-1.4-3.2-3.2 1.4-3.2 3.2-3.2z"/>
</svg>
