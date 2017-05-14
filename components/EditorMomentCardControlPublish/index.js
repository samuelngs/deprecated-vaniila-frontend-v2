
import React from 'react';

export default ({ active = false }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={active ? "icon icon-active" : "icon"}>
  <style jsx>{`
    .icon { padding: 1px; height: 16px; width: 16px; fill: #a8a8a8; pointer-events: none; }
    .icon-active { fill: #1ec369; }
  `}</style>
  <path d="M6.7 16.8l-4.4-4.4c-.2-.2-.2-.5 0-.6.2-.2.5-.2.6 0l4.4 4.4c.2.2.2.5 0 .6-.2.1-.4.1-.6 0z"/>
  <path d="M17.8 3.8L7.4 16.7c-.2.2-.4.2-.6.1-.2-.2-.2-.4-.1-.6L17.1 3.3c.2-.2.4-.2.6-.1.2.2.2.4.1.6z"/>
</svg>

